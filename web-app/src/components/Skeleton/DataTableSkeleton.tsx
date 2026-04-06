import React from 'react';

export const DataTableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex space-x-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4 mb-2">
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );
};
