"use client"
import { FileUploadManager } from '@/modules/files/FileUploadManager';

export default function FilesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">File Management</h1>
        <p className="text-gray-600 mt-1">Upload and manage your files for processing</p>
      </div>
      <FileUploadManager />
    </div>
  );
}
