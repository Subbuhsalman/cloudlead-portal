import React from 'react';

interface CheckmarkItemProps {
  text: string;
  className?: string;
  iconColor?: string;
}

export default function CheckmarkItem({ text, className = "", iconColor = "var(--primary-color)" }: CheckmarkItemProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_240_669)">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 10.593C0 7.88713 1.07489 5.29213 2.98819 3.37882C4.9015 1.46551 7.49651 0.390625 10.2023 0.390625C12.9082 0.390625 15.5032 1.46551 17.4165 3.37882C19.3298 5.29213 20.4047 7.88713 20.4047 10.593C20.4047 13.2988 19.3298 15.8938 17.4165 17.8071C15.5032 19.7204 12.9082 20.7953 10.2023 20.7953C7.49651 20.7953 4.9015 19.7204 2.98819 17.8071C1.07489 15.8938 0 13.2988 0 10.593ZM9.62012 14.9596L15.4939 7.6166L14.4329 6.76776L9.42424 13.0266L5.87654 10.0706L5.00595 11.1153L9.62012 14.9596Z" 
            fill={iconColor} 
          />
        </g>
        <defs>
          <clipPath id="clip0_240_669">
            <rect width="20.4047" height="20.4047" fill="white" transform="translate(0 0.390625)" />
          </clipPath>
        </defs>
      </svg>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}
