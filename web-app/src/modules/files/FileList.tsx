"use client"
import React from 'react';
import { 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  RefreshCw
} from 'lucide-react';
import { FileUploadData } from './FileUploadManager';

interface FileListProps {
  files: FileUploadData[];
  loading: boolean;
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    per_page: number;
  };
  onPageChange: (page: number) => void;
  onDeleteFile: (fileId: number) => void;
  onRefresh: () => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  loading,
  pagination,
  onPageChange,
  onDeleteFile,
  onRefresh
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UPLOADED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'PROCESSING':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UPLOADED':
        return 'Uploaded';
      case 'PROCESSING':
        return 'Processing';
      case 'COMPLETED':
        return 'Completed';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPLOADED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="h-10 w-10 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
              </div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
        <p className="text-gray-500">Upload your first file to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Showing {((pagination.currentPage - 1) * pagination.per_page) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.per_page, pagination.totalRecords)} of{' '}
            {pagination.totalRecords} files
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.file_upload_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.original_filename}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                        {getStatusIcon(file.status)}
                        <span className="ml-1">{getStatusText(file.status)}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>{file.file_type}</span>
                      <span>Uploaded {formatDate(file.created_at)}</span>
                      {file.processed_at && (
                        <span>Processed {formatDate(file.processed_at)}</span>
                      )}
                    </div>

                    {file.admin_notes && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>Admin Notes:</strong> {file.admin_notes}
                      </div>
                    )}

                    {file.ProcessedBy && (
                      <div className="mt-1 text-xs text-gray-500">
                        Processed by {file.ProcessedBy.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {/* Download Original File */}
                  <button
                    onClick={() => handleDownload(file.file_url, file.original_filename)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    title="Download original file"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Original
                  </button>

                  {/* Download Processed File */}
                  {file.processed_file_url && (
                    <button
                      onClick={() => handleDownload(file.processed_file_url!, `processed_${file.original_filename}`)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                      title="Download processed file"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Processed
                    </button>
                  )}

                  {/* Delete File */}
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this file?')) {
                        onDeleteFile(file.file_upload_id);
                      }
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
                    title="Delete file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
