"use client"
import React, { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { useHttp } from '@/hooks';
import { FileUploadData } from './FileUploadManager';

interface FileUploadProps {
  onUploadSuccess: (file: FileUploadData) => void;
  onUploadError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  loading,
  setLoading
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvRecordCount, setCsvRecordCount] = useState<number>(0);
  const [creditCost, setCreditCost] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const http = new useHttp();

  const allowedTypes = [
    'text/csv',
    'application/csv'
  ];

  const maxSize = 50 * 1024 * 1024; // 50MB

  const countCsvRecords = async (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim() !== '');
          
          if (lines.length <= 1) {
            resolve(0);
            return;
          }
          
          // Parse CSV header to get column indices
          const header = lines[0].split(',').map(col => col.trim());
          const emailIndex = header.findIndex(col => col.toLowerCase() === 'email');
          const directDial1Index = header.findIndex(col => col.toLowerCase() === 'direct dial 1');
          const directDial2Index = header.findIndex(col => col.toLowerCase() === 'direct dial 2');
          const directDial3Index = header.findIndex(col => col.toLowerCase() === 'direct dial 3');
          const directDial4Index = header.findIndex(col => col.toLowerCase() === 'direct dial 4');
          
          let creditCount = 0;
          
          // Process data rows (skip header)
          for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',').map(cell => cell.trim());
            
            // Check if email exists and is not empty
            const hasEmail = emailIndex >= 0 && row[emailIndex] && row[emailIndex] !== '';
            
            // Check if any Direct dial has phone number
            const directDial1 = directDial1Index >= 0 && row[directDial1Index] && row[directDial1Index] !== '';
            const directDial2 = directDial2Index >= 0 && row[directDial2Index] && row[directDial2Index] !== '';
            const directDial3 = directDial3Index >= 0 && row[directDial3Index] && row[directDial3Index] !== '';
            const directDial4 = directDial4Index >= 0 && row[directDial4Index] && row[directDial4Index] !== '';
            const hasPhoneNumber = directDial1 || directDial2 || directDial3 || directDial4;
            
            // Charge 1 credit if email exists OR if any direct dial has phone number
            if (hasEmail || hasPhoneNumber) {
              creditCount++;
            }
          }
          
          resolve(creditCount);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Only CSV files are allowed. Please upload a CSV file.';
    }
    if (file.size > maxSize) {
      return 'File size must be less than 50MB.';
    }
    return null;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      onUploadError(error);
      return;
    }
    
    try {
      const recordCount = await countCsvRecords(file);
      setCsvRecordCount(recordCount);
      setCreditCost(recordCount); // 1 credit per row if email exists OR if any Direct dial has phone number
      setSelectedFile(file);
    } catch (error) {
      onUploadError('Failed to read CSV file. Please check the file format.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await http.api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onUploadSuccess(response.data.data);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        onUploadError(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      onUploadError(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setCsvRecordCount(0);
    setCreditCost(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            Drop your file here, or{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500 underline"
              onClick={() => fileInputRef.current?.click()}
            >
              browse
            </button>
          </p>
          <p className="text-sm text-gray-500">
            Only CSV files allowed (Max: 50MB)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleFileInputChange}
          disabled={loading}
        />
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                {/* <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Records: <span className="font-medium">{csvRecordCount}</span>
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    Credit Cost: {creditCost} credits
                  </p>
                </div> */}
              </div>
            </div>
            <button
              type="button"
              onClick={removeSelectedFile}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={removeSelectedFile}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : `Upload File`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
