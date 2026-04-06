"use client"
import React, { useState, useRef } from 'react';
import { FileUploadData } from './FileProcessingManager';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';

interface FileProcessingModalProps {
  file: FileUploadData;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (fileId: number, status: string, adminNotes?: string) => void;
  onFileUpload: (fileId: number, processedFile: File, adminNotes?: string) => void;
  onDownloadFile: (url: string, filename: string) => void;
}

export const FileProcessingModal: React.FC<FileProcessingModalProps> = ({
  file,
  open,
  onClose,
  onStatusUpdate,
  onFileUpload,
  onDownloadFile
}) => {
  const [adminNotes, setAdminNotes] = useState(file.admin_notes || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'UPLOADED':
        return 'warning';
      case 'PROCESSING':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'danger';
      default:
        return null;
    }
  };

  const handleStatusUpdate = async (status: string) => {
    setLoading(true);
    try {
      await onStatusUpdate(file.file_upload_id, status, adminNotes);
      if (status === 'FAILED') {
        onClose();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      await onFileUpload(file.file_upload_id, selectedFile, adminNotes);
    } finally {
      setLoading(false);
    }
  };

  const onUpload = (event: any) => {
    const file = event.files[0];
    setSelectedFile(file);
  };

  const onRemove = () => {
    setSelectedFile(null);
  };

  const dialogHeader = (
    <div className="flex align-items-center">
      <i className="pi pi-file text-primary mr-2 text-xl"></i>
      <span>Process File</span>
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-between">
      <div className="flex gap-2">
        {file.status === 'UPLOADED' && (
          <Button
            label="Start Processing"
            icon="pi pi-play"
            severity="info"
            onClick={() => handleStatusUpdate('PROCESSING')}
            loading={loading}
          />
        )}
        
        <Button
          label="Mark as Failed"
          icon="pi pi-times"
          severity="danger"
          onClick={() => handleStatusUpdate('FAILED')}
          loading={loading}
        />
      </div>

      <div className="flex gap-2">
        <Button
          label="Close"
          icon="pi pi-times"
          outlined
          onClick={onClose}
          disabled={loading}
        />
        
        {selectedFile && (
          <Button
            label="Complete & Upload"
            icon="pi pi-upload"
            severity="success"
            onClick={handleFileUpload}
            loading={loading}
          />
        )}
      </div>
    </div>
  );

  return (
    <Dialog
      header={dialogHeader}
      visible={open}
      onHide={onClose}
      footer={dialogFooter}
      style={{ width: '90vw', maxWidth: '800px' }}
      maximizable
      modal
      className="p-fluid"
    >
      <div className="grid">
        {/* File Information */}
        <div className="col-12">
          <Card title="File Information" className="mb-3">
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">File Name</label>
                <p className="text-900 m-0">{file.original_filename}</p>
              </div>
              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">File Size</label>
                <p className="text-900 m-0">{formatFileSize(file.file_size)}</p>
              </div>
              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">File Type</label>
                <p className="text-900 m-0">{file.file_type}</p>
              </div>
              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Upload Date</label>
                <p className="text-900 m-0">{formatDate(file.created_at)}</p>
              </div>
              <div className="col-12">
                <label className="block text-900 font-medium mb-2">Status</label>
                <Tag 
                  value={file.status} 
                  severity={getStatusSeverity(file.status)}
                  icon={
                    file.status === 'PROCESSING' ? 'pi pi-spin pi-cog' :
                    file.status === 'COMPLETED' ? 'pi pi-check' :
                    file.status === 'FAILED' ? 'pi pi-times' : 'pi pi-clock'
                  }
                />
              </div>
            </div>
          </Card>
        </div>

        {/* User Information */}
        <div className="col-12">
          <Card title="User Information" className="mb-3">
            <div className="grid">
              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Name</label>
                <p className="text-900 m-0 flex align-items-center">
                  <i className="pi pi-user mr-2 text-600"></i>
                  {file.User.name}
                </p>
              </div>
              <div className="col-12 md:col-6">
                <label className="block text-900 font-medium mb-2">Email</label>
                <p className="text-900 m-0 flex align-items-center">
                  <i className="pi pi-envelope mr-2 text-600"></i>
                  {file.User.email}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Download Original File */}
        <div className="col-12">
          <Card className="mb-3">
            <div className="flex align-items-center justify-content-between">
              <div className="flex align-items-center">
                <i className="pi pi-file text-primary mr-3 text-2xl"></i>
                <div>
                  <p className="font-medium text-900 m-0">Original File</p>
                  <p className="text-600 text-sm m-0">Download the user&apos;s uploaded file</p>
                </div>
              </div>
              <Button
                label="Download"
                icon="pi pi-download"
                outlined
                onClick={() => onDownloadFile(file.file_url, file.original_filename)}
              />
            </div>
          </Card>
        </div>

        {/* Admin Notes */}
        <div className="col-12">
          <Card title="Admin Notes" className="mb-3">
            <InputTextarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Add notes about the processing, issues, or instructions for the user..."
              disabled={loading}
              className="w-full"
            />
          </Card>
        </div>

        {/* Upload Processed File */}
        <div className="col-12">
          <Card title="Upload Processed File">
            <FileUpload
              name="processed_file"
              accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
              maxFileSize={50000000}
              onUpload={onUpload}
              onRemove={onRemove}
              auto={false}
              customUpload
              uploadHandler={onUpload}
              emptyTemplate={
                <div className="text-center p-4">
                  <i className="pi pi-cloud-upload text-4xl text-400 mb-3"></i>
                  <p className="text-600 mb-0">Drag and drop files here to upload.</p>
                </div>
              }
            />
            
            {selectedFile && (
              <div className="mt-3 p-3 surface-100 border-round">
                <div className="flex align-items-center justify-content-between">
                  <div className="flex align-items-center">
                    <i className="pi pi-file text-primary mr-2"></i>
                    <div>
                      <p className="font-medium text-900 m-0">{selectedFile.name}</p>
                      <p className="text-600 text-sm m-0">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    icon="pi pi-times"
                    rounded
                    text
                    severity="danger"
                    onClick={() => setSelectedFile(null)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Dialog>
  );
};