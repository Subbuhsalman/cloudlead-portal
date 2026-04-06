"use client"
import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { FileList } from './FileList';
import { useHttp } from '@/hooks';
import { toast } from 'react-toastify';

export interface FileUploadData {
  file_upload_id: number;
  original_filename: string;
  file_url: string;
  file_size: number;
  file_type: string;
  status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  admin_notes?: string;
  processed_file_url?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  ProcessedBy?: {
    admin_user_id: number;
    name: string;
    email: string;
  };
}

export const FileUploadManager: React.FC = () => {
  const [files, setFiles] = useState<FileUploadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    per_page: 10
  });

  const http = new useHttp();

  useEffect(() => {
    fetchFiles();
  }, [pagination.currentPage]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/files/user-files?page=${pagination.currentPage}&per_page=${pagination.per_page}`);
      
      if (response.data.success) {
        setFiles(response.data.data.files);
        setPagination(response.data.data.pagination);
      } else {
        toast.error(response.data.message || 'Failed to fetch files');
      }
    } catch (error: any) {
      console.error('Error fetching files:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newFile: FileUploadData) => {
    setFiles(prev => [newFile, ...prev]);
    toast.success('File uploaded successfully!');
  };

  const handleUploadError = (error: string) => {
    toast.error(error);
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      const response = await http.delete(`/files/${fileId}`);
      
      if (response.data.success) {
        setFiles(prev => prev.filter(file => file.file_upload_id !== fileId));
        toast.success('File deleted successfully!');
      } else {
        toast.error(response.data.message || 'Failed to delete file');
      }
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error(error.response?.data?.message || 'Failed to delete file');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New File</h2>
        <FileUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          loading={uploadLoading}
          setLoading={setUploadLoading}
        />
      </div>

      {/* Files List Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Your Files</h2>
          <p className="text-sm text-gray-600 mt-1">
            {pagination.totalRecords} file{pagination.totalRecords !== 1 ? 's' : ''} total
          </p>
        </div>
        
        <FileList
          files={files}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onDeleteFile={handleDeleteFile}
          onRefresh={fetchFiles}
        />
      </div>
    </div>
  );
};
