"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { FileProcessingList } from './FileProcessingList';
import { FileProcessingModal } from './FileProcessingModal';
import { useHttp, useGlobalHook } from '@/hooks';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

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
  User: {
    user_id: number;
    name: string;
    email: string;
  };
  ProcessedBy?: {
    admin_user_id: number;
    name: string;
    email: string;
  };
}

export const FileProcessingManager: React.FC = () => {
  const [files, setFiles] = useState<FileUploadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileUploadData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    per_page: 10
  });

  const http = new useHttp();
  const { updateGlobalToast } = useGlobalHook();

  const fetchPendingFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await http.api.get(`/admin/files/pending?page=${pagination.currentPage}&per_page=${pagination.per_page}`);
      
      if (response.data.success) {
        setFiles(response.data.data.files);
        setPagination(response.data.data.pagination);
      } else {
        updateGlobalToast({
          showToast: true,
          toastMessage: 'Error',
          toastDetail: response.data.message || 'Failed to fetch pending files',
          toastType: 'error'
        });
      }
    } catch (error: any) {
      console.error('Error fetching pending files:', error);
      updateGlobalToast({
        showToast: true,
        toastMessage: 'Error',
        toastDetail: error.response?.data?.message || 'Failed to fetch pending files',
        toastType: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.per_page]);

  useEffect(() => {
    fetchPendingFiles();
  }, [fetchPendingFiles]);

  const handleProcessFile = (file: FileUploadData) => {
    setSelectedFile(file);
    setModalOpen(true);
  };

  const handleStatusUpdate = async (fileId: number, status: string, adminNotes?: string) => {
    try {
      
      const response: any = await http.api.put(`/admin/files/${fileId}/status`, {
        status,
        admin_notes: adminNotes
      });


      if (response.data.success) {
        // Update the file in the list
        setFiles(prev => prev.map(file => 
          file.file_upload_id === fileId 
            ? { ...file, ...response.data.data }
            : file
        ));
        updateGlobalToast({
          showToast: true,
          toastMessage: 'Success',
          toastDetail: 'File status updated successfully!',
          toastType: 'success'
        });
        
        // If failed, remove from pending list
        if (status === 'FAILED') {
          setFiles(prev => prev.filter(file => file.file_upload_id !== fileId));
        }
      } else {
        updateGlobalToast({
          showToast: true,
          toastMessage: 'Error',
          toastDetail: response.data.message || 'Failed to update file status',
          toastType: 'error'
        });
      }
    } catch (error: any) {
      console.error('Error updating file status:', error);
      updateGlobalToast({
        showToast: true,
        toastMessage: 'Error',
        toastDetail: error.response?.data?.message || 'Failed to update file status',
        toastType: 'error'
      });
    }
  };

  const handleFileUpload = async (fileId: number, processedFile: File, adminNotes?: string) => {
    try {
      
      const formData = new FormData();
      formData.append('processed_file', processedFile);
      if (adminNotes) {
        formData.append('admin_notes', adminNotes);
      }

      const response = await http.api.post(`/admin/files/${fileId}/upload-processed`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      if (response.data.success) {
        // Remove from pending list as it's now completed
        setFiles(prev => prev.filter(file => file.file_upload_id !== fileId));
        updateGlobalToast({
          showToast: true,
          toastMessage: 'Success',
          toastDetail: 'Processed file uploaded successfully! User will be notified by email.',
          toastType: 'success'
        });
        setModalOpen(false);
        setSelectedFile(null);
      } else {
        updateGlobalToast({
          showToast: true,
          toastMessage: 'Error',
          toastDetail: response.data.message || 'Failed to upload processed file',
          toastType: 'error'
        });
      }
    } catch (error: any) {
      console.error('Error uploading processed file:', error);
      updateGlobalToast({
        showToast: true,
        toastMessage: 'Error',
        toastDetail: error.response?.data?.message || 'Failed to upload processed file',
        toastType: 'error'
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleDownloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-column gap-4">
      {/* Stats Cards */}
      <div className="grid">
        <div className="col-12 md:col-4">
          <Card className="shadow-2">
          <div className="flex align-items-center">
            <div className="flex-shrink-0">
              <div className="w-3rem h-3rem bg-yellow-100 border-circle flex align-items-center justify-content-center">
                <i className="pi pi-clock text-yellow-600 text-xl"></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-600">Pending Files</p>
              <p className="text-2xl font-semibold text-900">{pagination.totalRecords}</p>
            </div>
          </div>
          </Card>
        </div>
        
        <div className="col-12 md:col-4">
          <Card className="shadow-2">
            <div className="flex align-items-center">
              <div className="flex-shrink-0">
                <div className="w-3rem h-3rem bg-blue-100 border-circle flex align-items-center justify-content-center">
                  <i className="pi pi-spin pi-cog text-blue-600 text-xl"></i>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-600">Processing</p>
                <p className="text-2xl font-semibold text-900">
                  {files.filter(f => f.status === 'PROCESSING').length}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="col-12 md:col-4">
          <Card className="shadow-2">
            <div className="flex align-items-center">
              <div className="flex-shrink-0">
                <div className="w-3rem h-3rem bg-green-100 border-circle flex align-items-center justify-content-center">
                  <i className="pi pi-check text-green-600 text-xl"></i>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-600">Today&apos;s Completed</p>
                <p className="text-2xl font-semibold text-900">-</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Files List */}
      <Card className="shadow-2">
        <div className="p-4 border-bottom-1 surface-border">
          <div className="flex align-items-center justify-content-between">
            <div>
              <h2 className="text-xl font-semibold text-900 m-0">Pending Files</h2>
              <p className="text-sm text-600 mt-1 m-0">
                {pagination.totalRecords} file{pagination.totalRecords !== 1 ? 's' : ''} awaiting processing
              </p>
            </div>
            <Button
              icon="pi pi-refresh"
              label="Refresh"
              onClick={fetchPendingFiles}
              className="p-button-outlined"
              size="small"
            />
          </div>
        </div>
        
        <FileProcessingList
          files={files}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onProcessFile={handleProcessFile}
          onStatusUpdate={handleStatusUpdate}
          onDownloadFile={handleDownloadFile}
        />
      </Card>

      {/* Processing Modal */}
      {selectedFile && modalOpen && (
        <FileProcessingModal
          file={selectedFile}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedFile(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          onFileUpload={handleFileUpload}
          onDownloadFile={handleDownloadFile}
        />
      )}
    </div>
  );
};

