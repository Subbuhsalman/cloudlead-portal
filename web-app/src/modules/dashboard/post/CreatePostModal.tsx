import React, { useState, useEffect } from 'react';
import {
    Image as ImageIcon,
    X,
    UploadCloud,
    Clock
} from 'lucide-react';
import { AIBadge } from './AIBadge';
import { usePostHook } from '@/modules/Post';
import { useHttp } from '@/hooks';
import { MediaLibraryModal } from './MediaLibraryModal';
import { EmojiOverlay } from '@/components/EmojiOverlay';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    provider: 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN';
    unsplashAccessKey: string; // Pass Unsplash API key
    onPostCreated: (newPost: any) => void;
    selectedChannel: any;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, selectedChannel }: any) => {
    const provider = selectedChannel.provider;
    const [postContent, setPostContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<any | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [scheduleOption, setScheduleOption] = useState('NOW');
    const [customDate, setCustomDate] = useState('');

    const [wordCount, setWordCount] = useState(0);
    const [showUnsplash, setShowUnsplash] = useState(false);
    const { PostSubmit: _PostSubmit, saveForm: createPost } = usePostHook();

    // Word count
    useEffect(() => {
        const count = postContent.trim().split(/\s+/).filter(Boolean).length;
        setWordCount(count);
    }, [postContent]);

    const handleCreatePost = async (isDraft: boolean) => {

        let payload: any = {
            content: postContent,
            provider: provider,
            channelId: selectedChannel.channel_id,
            scheduledDateTime: customDate,
            scheduleOption: scheduleOption as any,
            mediaUrl: selectedImage?.filePreview || undefined,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's browser timezone
        };
        if (isDraft) {
            payload = {
                ...payload,
                status: "DRAFT"
            }
        }

        // If custom date is set
        if (scheduleOption === "SET_DATE" && customDate) {
            payload = {
                ...payload,
                scheduledDateTime: customDate
            }
        }

        try {

            const db = new useHttp()
            const response: any = db.post("/post", payload)

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const result = await response.json();
            console.log('Post created:', result);
            return result;
        } catch (_error) {
            console.error('Error creating post:', _error);
            throw _error;
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const formPostData = new FormData();
            formPostData.append("post_image", file);
            const db = new useHttp()
            const reader = new FileReader();
            reader.onload = () => setSelectedImage({ filePreview: reader.result as string, file: file });
            reader.readAsDataURL(file);
            try {
                const response: any = await db.postV2("/post/upload-image", formPostData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                setSelectedImage({ filePreview: response?.data?.files?.location as string, file: file })
            } catch (_error) {
                console.error('Error uploading image:', _error);
            }
        }
    };

    if (!isOpen && selectedChannel === null) return null;

    const SelectCard = () => (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(_e) => setDragActive(false)}
            onDrop={handleDrop}
            className={`w-30 mx-3 border-2 ${dragActive ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300'} rounded-xl p-3 text-center`}
        >
            <UploadCloud size={24} className="mx-auto text-gray-400 mb-1" />
            <p className="text-[12px] text-gray-500 text-sm mb-0">Drag & drop or</p>
            <button
                onClick={() => setShowUnsplash(true)}
                className="text-[12px] text-[var(--primary-color)] text-sm hover:text-green-700"
            >
                Select a File
            </button>
        </div>
    );
    console.log("selectedImage", selectedImage)

    return (
        <div className="fixed bg-[#000]/30 inset-0  flex items-center justify-center z-50 p-4">
            <div className="rounded-xl w-full max-w-5xl gap-6 h-auto flex overflow-hidden shadow-2xl">

                {/* Left - Create Post */}
                <div className="flex-1 flex flex-col">
                    <div className='bg-white p-6 py-10 rounded-3xl shadow-sm h-full flex flex-col'>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Create {selectedChannel?.handle} Post</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className='flex'>
                            <div className="flex items-start p-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {provider}
                                </div>
                            </div>

                            <div className='w-full'>
                                <div className='border border-gray-200 rounded-xl'>

                                    {/* Text Area */}
                                    <div className="mb-4 flex-1">
                                        <div className="relative">
                                            <textarea
                                                value={postContent}
                                                onChange={(e) => setPostContent(e.target.value)}
                                                placeholder="Start writing..."
                                                className="w-full h-24 p-3 resize-none focus:outline-none text-sm"
                                            />
                                            <span className='absolute top-3 right-3'>
                                                <AIBadge />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="mb-4">
                                        {selectedImage ? (
                                            <div className='flex'>
                                                <div className="relative mx-3 ">
                                                    <img src={selectedImage?.filePreview} alt="Selected" className="w-30 h-24 rounded-lg object-cover" />
                                                    <button
                                                        onClick={() => setSelectedImage(null)}
                                                        className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <SelectCard />
                                            </div>
                                        ) : (
                                            <SelectCard />
                                        )}
                                    </div>

                                    {/* Bottom Toolbar */}
                                    <div className="flex items-center justify-between mb-4 border-t border-gray-200 pt-3 px-3">
                                        <div className="flex items-center gap-4">
                                            <button type='button' onClick={() => setShowUnsplash(true)} className="text-gray-400 hover:text-gray-600">
                                                <ImageIcon size={18} />
                                            </button>
                                            <EmojiOverlay onSelectEmoji={(emoji:any)=>{ 
                                            console.log("emoji", emoji)
                                            setPostContent(`${postContent}${emoji}`)
                                            }} />
                                            <AIBadge />
                                        </div>
                                        
                                        <span className="text-black font-light text-xs bg-gray-200 rounded-2xl px-2 py-1">{wordCount} Words</span>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div className="flex justify-between mt-4">
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">When to Post</label>
                                        {scheduleOption === "SET_DATE" ? (
                                            <>
                                                <div className='flex'>
                                                    <input
                                                        type="datetime-local"
                                                        className="text-gray-500 border border-gray-100 focus:outline-none rounded-lg px-2 py-1 text-sm"
                                                        onChange={(e) => setCustomDate(e.target.value)}
                                                    />
                                                    <button onClick={() => { setScheduleOption('NOW') }} className="bg-gray-200 rounded-3xl px-2 text-sm text-gray-700">
                                                        <X size={14} className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <button onClick={() => setScheduleOption('SET_DATE')} className="flex items-center gap-1 text-sm text-gray-700">
                                                Now
                                                <Clock size={14} className="text-gray-400" />
                                            </button>
                                        )}
                                    </div>

                                    <div className='mt-2'>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleCreatePost(true)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                                Save to Draft
                                            </button>
                                            <button onClick={() => handleCreatePost(false)} className="px-4 py-2 gap-2 flex bg-[var(--primary-color)] text-white rounded-lg text-sm hover:bg-green-700">
                                                Schedule Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right - Preview */}
                <div className="w-80">
                    <div className='bg-white p-6 py-10 rounded-3xl shadow-sm h-full flex flex-col'>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Preview</h3>
                        {selectedImage || postContent ? (
                            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                                <div className="p-3 flex items-center gap-2 border-b border-gray-100">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">{selectedChannel?.handle}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">{selectedChannel?.handle}</span>
                                    </div>
                                </div>
                                <p className="p-3 text-sm text-gray-800 mb-0">{postContent}</p>
                                {selectedImage && <img src={selectedImage.filePreview} className="w-full h-60 object-cover" />}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg p-8 text-center">
                                <img src="/assets/icons/preview-icon.png" alt="Preview Icon" className="w-full h-auto" />
                                <p className="text-gray-500 text-sm">See your post's preview here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Unsplash Modal */}
            {showUnsplash && (
                <MediaLibraryModal isOpen={showUnsplash} onClose={() => setShowUnsplash(false)} onImageSelect={(image) => {
                    console.log("image", image)
                    setSelectedImage({ filePreview: image?.url as string })
                }} />
            )}
        </div>
    );
};

export { CreatePostModal };
