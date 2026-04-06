import React from 'react';
import Image from 'next/image';

interface FeatureCardProps {
  imageSrc: string;
  text: string;
  alt: string;
}

export default function FeatureCard({ 
  imageSrc, 
  text, 
  alt 
}: FeatureCardProps) {
  return (
    <div className=" rounded-2xl overflow-hidden">
      {/* Image Section */}
      <div className="h-48 md:h-56 ">
        <Image 
          src={imageSrc} 
          alt={alt}
          width={400}
          height={224}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Text Section */}
      <div style={{position:'relative'}} className="bg-[#F8F6FF]  mt-[-20px] z-10 rounded-2xl p-6 py-8">
        <p className="text-[#09005C] font-medium text-[22px] px-9 leading-relaxed text-center">
          {text}
        </p>
      </div>
    </div>
  );
}
