import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Image as ImageIcon,
    X,
    UploadCloud,
    Search,
    Loader2,
    Download,
    Heart,
    AlertCircle} from 'lucide-react';
import { useHttp } from '@/hooks';

interface UnsplashImage {
    id: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    alt_description: string;
    description: string;
    user: {
        name: string;
        username: string;
        profile_image: {
            small: string;
            medium: string;
            large: string;
        };
    };
    width: number;
    height: number;
    created_at: string;
    updated_at: string;
    likes: number;
    downloads?: number;
}

interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
}

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (image: any) => void;
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({ 
    isOpen, 
    onClose, 
    onImageSelect 
}) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'unsplash'>('unsplash');
    const [activeSubTab, setActiveSubTab] = useState<'search' | 'popular' | 'curated'>('search');
    const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        orientation: '',
        color: '',
        order_by: 'relevant'
    });
    const [pagination, setPagination] = useState<PaginationMeta>({
        current_page: 1,
        per_page: 15,
        total: 0,
        total_pages: 0,
        has_next_page: false,
        has_prev_page: false
    });
    const [dragActive, setDragActive] = useState(false);
    const [retryAfter, setRetryAfter] = useState<number>(0);
    
    const http = new useHttp();
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Handle rate limit retry
    useEffect(() => {
        if (retryAfter > 0) {
            const timer = setInterval(() => {
                setRetryAfter(prev => {
                    if (prev <= 1) {
                        setError('');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [retryAfter]);

    // Fetch images based on active sub-tab
    const fetchImages = useCallback(async (page: number = 1, append: boolean = false) => {
        setLoading(true);
        setError('');

        try {
            let endpoint = '';
            let params = new URLSearchParams({
                page: page.toString(),
                per_page: pagination.per_page.toString()
            });

            switch (activeSubTab) {
                case 'search':
                    if (!searchQuery.trim()) {
                        setError('Please enter a search query');
                        setLoading(false);
                        return;
                    }
                    endpoint = '/gallery/search';
                    params.append('query', searchQuery.trim());
                    // Add filters for search
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value) params.append(key, value);
                    });
                    break;
                case 'popular':
                    endpoint = '/gallery/popular';
                    break;
                case 'curated':
                    endpoint = '/gallery/curated';
                    break;
            }

            const res:any = await http.get(`${endpoint}?${params.toString()}`);
            const response = res?.data;
            
            if (response.success) {
                if (append) {
                    setUnsplashImages(prev => [...prev, ...response.data]);
                } else {
                    setUnsplashImages(response.data);
                }
                setPagination(response.meta);
            } else {
                setError(response.error || 'Failed to fetch images');
            }
        } catch (error: any) {
            console.error('Error fetching images:', error);
            
            if (error.response?.status === 429) {
                const retryAfterSeconds = error.response.data?.retry_after || 3600;
                setRetryAfter(retryAfterSeconds);
                setError(`Rate limit exceeded. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`);
            } else {
                setError(error.response?.data?.error || 'Failed to fetch images. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [activeSubTab, searchQuery, filters, pagination.per_page, http]);

    // Initialize with curated images when modal opens
    useEffect(() => {
        if (isOpen && activeTab === 'unsplash' && unsplashImages.length === 0) {
            fetchImages(1);
        }
    }, [isOpen, activeTab]);

    // Handle sub-tab change
    const handleSubTabChange = (newTab: 'search' | 'popular' | 'curated') => {
        if (newTab !== activeSubTab) {
            setActiveSubTab(newTab);
            setUnsplashImages([]);
            setPagination(prev => ({ ...prev, current_page: 1 }));
            
            // Focus search input when switching to search tab
            if (newTab === 'search') {
                setTimeout(() => searchInputRef.current?.focus(), 100);
            }
        }
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setUnsplashImages([]);
            fetchImages(1);
        }
    };

    // Clear search and switch to curated
    const handleClearSearch = () => {
        setSearchQuery('');
        setActiveSubTab('curated');
        setUnsplashImages([]);
        fetchImages(1);
    };

    // Load more images
    const loadMoreImages = () => {
        if (pagination.has_next_page && !loading) {
            fetchImages(pagination.current_page + 1, true);
        }
    };

    // Handle image selection
    const handleImageSelect = async (image: UnsplashImage) => {
        try {
            // Trigger download tracking
            await http.post(`/gallery/${image.id}/download`,{});
            
            // Pass the selected image back to parent
            onImageSelect({
                filePreview: image.urls.regular,
                url: image.urls.regular,
                alt: image.alt_description || image.description,
                credit: {
                    photographer: image.user.name,
                    username: image.user.username,
                    profile_image: image.user.profile_image.small,
                    unsplash_url: `https://unsplash.com/@${image.user.username}?utm_source=your_app_name&utm_medium=referral`
                }
            });
            
            onClose();
        } catch (error) {
            console.error('Error selecting image:', error);
            // Still allow selection even if tracking fails
            onImageSelect({
                filePreview: image.urls.regular,
                url: image.urls.regular,
                alt: image.alt_description || image.description,
                credit: {
                    photographer: image.user.name,
                    username: image.user.username,
                    profile_image: image.user.profile_image.small
                }
            });
            onClose();
        }
    };

    // Handle file upload
    const handleFileUpload = async (file: File) => {
        try {
            const reader = new FileReader();
            reader.onload = () => {
                onImageSelect({
                    filePreview: reader.result as string,
                    file: file
                });
                onClose();
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError('Failed to upload file. Please try again.');
        }
    };

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        } else {
            setError('Please upload a valid image file.');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    // Handle file input
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setUnsplashImages([]);
            setSearchQuery('');
            setError('');
            setRetryAfter(0);
            setActiveSubTab('curated');
            setPagination(prev => ({ ...prev, current_page: 1 }));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#000]/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Media Library</h2>
                        <p className="text-sm text-gray-600 mt-1">Choose from your files or stock photos</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Main Tabs */}
                {/* <div className="flex border-b bg-gray-50">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'upload'
                                ? 'border-green-500 text-[var(--primary-color)] bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <UploadCloud size={16} />
                            Upload Files
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('unsplash')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'unsplash'
                                ? 'border-green-500 text-[var(--primary-color)] bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <ImageIcon size={16} />
                            Stock Photos
                        </div>
                    </button>
                </div> */}

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    
                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <div className="h-full flex items-center justify-center p-8">
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`w-full max-w-md border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                                    dragActive 
                                        ? 'border-green-500 bg-green-50 scale-105' 
                                        : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                                }`}
                            >
                                <UploadCloud size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Drop your files here
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Drag and drop your images, or click to browse
                                </p>
                                <label className="inline-block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInput}
                                        className="hidden"
                                    />
                                    <span className="px-6 py-3 bg-green-600 text-white rounded-lg text-sm cursor-pointer hover:bg-green-700 transition-colors font-medium">
                                        Browse Files
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Unsplash Tab */}
                    {activeTab === 'unsplash' && (
                        <div className="h-full flex flex-col">
                            
                            {/* Sub Tabs */}
                            {/* <div className="flex border-b bg-gray-50 px-6">
                                <button
                                    onClick={() => handleSubTabChange('curated')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                        activeSubTab === 'curated'
                                            ? 'border-green-500 text-[var(--primary-color)]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={14} />
                                        Curated
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleSubTabChange('popular')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                        activeSubTab === 'popular'
                                            ? 'border-green-500 text-[var(--primary-color)]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Heart size={14} />
                                        Popular
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleSubTabChange('search')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                        activeSubTab === 'search'
                                            ? 'border-green-500 text-[var(--primary-color)]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Search size={14} />
                                        Search
                                    </div>
                                </button>
                            </div> */}

                            {/* Search Bar (only visible when search tab is active) */}
                            {activeSubTab === 'search' && (
                                <div className="p-6 border-b bg-white space-y-4">
                                    <form onSubmit={handleSearch} className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search for photos..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading || !searchQuery.trim()}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
                                        </button>
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={handleClearSearch}
                                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </form>

                                    {/* Filters */}
                                    <div className="flex gap-4 text-sm">
                                        <select
                                            value={filters.orientation}
                                            onChange={(e) => setFilters(prev => ({ ...prev, orientation: e.target.value }))}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                        >
                                            <option value="">All Orientations</option>
                                            <option value="landscape">Landscape</option>
                                            <option value="portrait">Portrait</option>
                                            <option value="squarish">Square</option>
                                        </select>

                                        <select
                                            value={filters.color}
                                            onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                        >
                                            <option value="">All Colors</option>
                                            <option value="black_and_white">Black & White</option>
                                            <option value="black">Black</option>
                                            <option value="white">White</option>
                                            <option value="yellow">Yellow</option>
                                            <option value="orange">Orange</option>
                                            <option value="red">Red</option>
                                            <option value="purple">Purple</option>
                                            <option value="magenta">Magenta</option>
                                            <option value="green">Green</option>
                                            <option value="teal">Teal</option>
                                            <option value="blue">Blue</option>
                                        </select>

                                        <select
                                            value={filters.order_by}
                                            onChange={(e) => setFilters(prev => ({ ...prev, order_by: e.target.value }))}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                        >
                                            <option value="relevant">Most Relevant</option>
                                            <option value="latest">Latest</option>
                                            <option value="popular">Most Popular</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                    {retryAfter > 0 && (
                                        <span className="ml-auto font-mono text-xs">
                                            Retry in: {Math.floor(retryAfter / 60)}:{(retryAfter % 60).toString().padStart(2, '0')}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Images Grid */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {loading && unsplashImages.length === 0 ? (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="text-center">
                                            <Loader2 size={32} className="animate-spin text-[var(--primary-color)] mx-auto mb-4" />
                                            <p className="text-gray-500">Loading beautiful photos...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {unsplashImages.map((image) => (
                                                <div
                                                    key={image.id}
                                                    className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
                                                    onClick={() => handleImageSelect(image)}
                                                >
                                                    <img
                                                        src={image.urls.small}
                                                        alt={image.alt_description || 'Unsplash photo'}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                    
                                                    {/* Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                                        <div className="p-3 text-white w-full">
                                                            <div className="flex items-center gap-2 text-xs mb-2">
                                                                <img
                                                                    src={image.user.profile_image.small}
                                                                    alt={image.user.name}
                                                                    className="w-5 h-5 rounded-full border border-white/20"
                                                                />
                                                                <span className="font-medium truncate">{image.user.name}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between text-xs">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center gap-1">
                                                                        <Heart size={12} />
                                                                        <span>{image.likes.toLocaleString()}</span>
                                                                    </div>
                                                                    {image.downloads && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Download size={12} />
                                                                            <span>{image.downloads.toLocaleString()}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs opacity-80">
                                                                    {image.width} × {image.height}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Selection indicator */}
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Load More Button */}
                                        {pagination.has_next_page && !error && (
                                            <div className="flex justify-center mt-8">
                                                <button
                                                    onClick={loadMoreImages}
                                                    disabled={loading || retryAfter > 0}
                                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Loader2 size={16} className="animate-spin" />
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        'Load More Photos'
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {/* Results Info */}
                                        {pagination.total > 0 && !error && (
                                            <div className="text-center mt-6 text-sm text-gray-500">
                                                Showing {unsplashImages.length} of {pagination.total.toLocaleString()} images
                                            </div>
                                        )}

                                        {/* No Results */}
                                        {!loading && unsplashImages.length === 0 && !error && (
                                            <div className="text-center py-12">
                                                <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    No images found
                                                </h3>
                                                <p className="text-gray-500 mb-4">
                                                    {activeSubTab === 'search' 
                                                        ? 'Try adjusting your search terms or filters'
                                                        : 'Unable to load images at the moment'
                                                    }
                                                </p>
                                                {activeSubTab === 'search' && (
                                                    <button
                                                        onClick={handleClearSearch}
                                                        className="px-4 py-2 text-[var(--primary-color)] border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                                    >
                                                        Browse Curated Photos
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                            {activeTab === 'unsplash' && (
                                <span>Photos provided by <a href="https://unsplash.com?utm_source=your_app_name&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="text-[var(--primary-color)] hover:underline">Unsplash</a></span>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export  {MediaLibraryModal};