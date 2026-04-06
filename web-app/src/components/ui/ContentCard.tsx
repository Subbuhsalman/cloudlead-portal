import React from 'react';
import Image from 'next/image';

interface ContentCardProps {
  text: string;
  imageSrc: string;
  onClick?: () => void;
  className?: string;
}

export default function ContentCard({ 
  text, 
  imageSrc, 
  onClick,
  className = "" 
}: ContentCardProps) {
  return (
    <button 
      onClick={onClick}
      className={`bg-[#FCFBFF]  rounded-xl p-4 border border-[var(--primary-color)1F] hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        <Image 
          src={imageSrc} 
          alt={text}
          width={32}
          height={32}
          className="w-8 h-8"
        />
      </div>
      <span className="text-sm font-medium text-gray-700 text-center leading-tight">
        {text}
      </span>
    </button>
  );
}
