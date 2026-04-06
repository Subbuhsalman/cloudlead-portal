"use client"
import React from 'react';
import { FileUploadData } from './FileProcessingManager';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';

interface FileProcessingListProps {
  files: FileUploadData[];
  loading: boolean;
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    per_page: number;
  };
  onPageChange: (page: number) => void;
  onProcessFile: (file: FileUploadData) => void;
  onStatusUpdate: (fileId: number, status: string, adminNotes?: string) => void;
  onDownloadFile: (url: string, filename: string) => void;
}

export const FileProcessingList: React.FC<FileProcessingListProps> = ({
  files,
  loading,
  pagination,
  onPageChange,
  onProcessFile,
  onStatusUpdate,
  onDownloadFile
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

  const getPriorityTag = (uploadDate: string) => {
    const hoursOld = (new Date().getTime() - new Date(uploadDate).getTime()) / (1000 * 60 * 60);
    if (hoursOld > 24) {
      return { severity: 'danger' as const, value: `High Priority ` };
    } else if (hoursOld > 12) {
      return { severity: 'warning' as const, value: `Medium Priority ` };
    } else {
      return { severity: 'success' as const, value: `Recent ` };
    }
  };

  // Column templates
  const fileNameTemplate = (rowData: FileUploadData) => {
    return (
      <div className="flex align-items-center">
        <i className="pi pi-file text-blue-500 mr-2 text-xl"></i>
        <div>
          <div className="font-medium text-900">{rowData.original_filename}</div>
          <div className="text-sm text-600">{formatFileSize(rowData.file_size)} • {rowData.file_type}</div>
        </div>
      </div>
    );
  };

  const userTemplate = (rowData: FileUploadData) => {
    return (
      <div className="flex align-items-center">
        <i className="pi pi-user text-600 mr-2"></i>
        <div>
          <div className="font-medium text-900">{rowData.User.name}</div>
          <div className="text-sm text-600">{rowData.User.email}</div>
        </div>
      </div>
    );
  };

  const statusTemplate = (rowData: FileUploadData) => {
    return (
      <Tag 
        value={rowData.status} 
        severity={getStatusSeverity(rowData.status)}
        icon={
          rowData.status === 'PROCESSING' ? 'pi pi-spin pi-cog' :
          rowData.status === 'COMPLETED' ? 'pi pi-check' :
          rowData.status === 'FAILED' ? 'pi pi-times' : 'pi pi-clock'
        }
      />
    );
  };

  const priorityTemplate = (rowData: FileUploadData) => {
    const priority = getPriorityTag(rowData.created_at);
    return <Tag value={priority.value} severity={priority.severity} />;
  };

  const uploadDateTemplate = (rowData: FileUploadData) => {
    return (
      <div>
        <div className="text-900">{formatDate(rowData.created_at)}</div>
        {rowData.ProcessedBy && (
          <div className="text-sm text-600">
            Processed by {rowData.ProcessedBy.name}
          </div>
        )}
      </div>
    );
  };

  const actionsTemplate = (rowData: FileUploadData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-download"
          size="small"
          outlined
          tooltip="Download original file"
          onClick={() => onDownloadFile(rowData.file_url, rowData.original_filename)}
        />
        
        <Button
          icon="pi pi-cog"
          size="small"
          severity="success"
          tooltip="Process file"
          onClick={() => onProcessFile(rowData)}
        />
        
        {rowData.status === 'UPLOADED' && (
          <Button
            icon="pi pi-play"
            size="small"
            severity="info"
            tooltip="Start processing"
            onClick={() => onStatusUpdate(rowData.file_upload_id, 'PROCESSING')}
          />
        )}
        
        {rowData.status === 'PROCESSING' && (
          <Button
            icon="pi pi-times"
            size="small"
            severity="danger"
            tooltip="Mark as failed"
            onClick={() => onStatusUpdate(rowData.file_upload_id, 'FAILED', 'Processing failed - please check the file format')}
          />
        )}
      </div>
    );
  };

  const expandedRowTemplate = (rowData: FileUploadData) => {
    return (
      <div className="p-3">
        {rowData.admin_notes && (
          <div className="mb-3">
            <strong className="text-900">Admin Notes:</strong>
            <div className="mt-1 p-3 bg-blue-50 border-round text-sm">
              {rowData.admin_notes}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center p-8">
        <ProgressSpinner />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center p-8">
        <i className="pi pi-file text-6xl text-400 mb-4"></i>
        <h3 className="text-xl font-semibold text-900 mb-2">No pending files</h3>
        <p className="text-600">All files have been processed. Great job!</p>
      </div>
    );
  }

  return (
    <div>
      <DataTable 
        value={files} 
        stripedRows 
        showGridlines
        size="small"
        expandedRows={files.filter(f => f.admin_notes)}
        rowExpansionTemplate={expandedRowTemplate}
        emptyMessage="No files found"
        className="p-datatable-sm"
      >
        <Column 
          expander 
          style={{ width: '3rem' }} 
        />
        <Column 
          field="original_filename" 
          header="File" 
          body={fileNameTemplate}
          style={{ minWidth: '250px' }}
        />
        <Column 
          field="User" 
          header="User" 
          body={userTemplate}
          style={{ minWidth: '200px' }}
        />
        <Column 
          field="status" 
          header="Status" 
          body={statusTemplate}
          style={{ minWidth: '120px' }}
        />
        <Column 
          field="created_at" 
          header="Upload Date" 
          body={uploadDateTemplate}
          style={{ minWidth: '180px' }}
        />
        <Column 
          header="Priority" 
          body={priorityTemplate}
          style={{ minWidth: '150px' }}
        />
        <Column 
          header="Actions" 
          body={actionsTemplate}
          style={{ minWidth: '200px' }}
        />
      </DataTable>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Paginator
            first={(pagination.currentPage - 1) * pagination.per_page}
            rows={pagination.per_page}
            totalRecords={pagination.totalRecords}
            onPageChange={(e) => onPageChange(e.page + 1)}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} files"
          />
          </div>
        )}
    </div>
  );
};