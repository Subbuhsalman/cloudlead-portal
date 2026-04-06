"use client"
import { FileProcessingManager } from '@/modules/FileProcessing/FileProcessingManager';

export default function FileProcessingPage() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-900 mb-2">File Processing</h1>
        <p className="text-600">Manage and process user uploaded files</p>
      </div>
      <FileProcessingManager />
    </div>
  );
}
