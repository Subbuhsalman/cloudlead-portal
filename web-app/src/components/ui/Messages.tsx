import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onClose, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 ${className}`}>
      <AlertCircle className="mr-2 flex-shrink-0" size={20} />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  onClose, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center p-4 bg-green-100 border border-green-300 rounded-lg text-green-700 ${className}`}>
      <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 text-green-500 hover:text-green-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

interface InfoMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export const InfoMessage: React.FC<InfoMessageProps> = ({ 
  message, 
  onClose, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-700 ${className}`}>
      <svg className="mr-2 flex-shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 text-blue-500 hover:text-blue-700"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
