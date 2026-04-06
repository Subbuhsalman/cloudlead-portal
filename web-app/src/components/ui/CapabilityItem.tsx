import React from 'react';

interface CapabilityItemProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export default function CapabilityItem({ 
  title, 
  content, 
  icon, 
  className = "bg-gray-50", 
  iconClassName = "bg-green-100" 
}: CapabilityItemProps) {
  const defaultIcon = (
    <svg width="35" height="32" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_240_554)">
    <path d="M31.0684 10.5237C32.8168 8.77524 32.0196 6.73309 31.0684 5.73999L26.8722 1.54378C25.1098 -0.204634 23.0816 0.592644 22.0885 1.54378L19.7107 3.93562H16.088C13.4304 3.93562 11.8918 5.33436 11.1085 6.9429L4.89808 13.1533V18.7482L3.90498 19.7273C2.15656 21.4897 2.95384 23.5179 3.90498 24.511L8.10118 28.7072C8.8565 29.4625 9.66776 29.7423 10.4371 29.7423C11.4302 29.7423 12.3393 29.2527 12.8849 28.7072L16.6614 24.9166H21.6829C24.0607 24.9166 25.2637 23.434 25.6973 21.9793C27.2778 21.5597 28.1451 20.3568 28.4947 19.1818C30.6628 18.6223 31.474 16.5662 31.474 15.1255V10.9293H30.6488L31.0684 10.5237ZM28.6766 15.1255C28.6766 15.7549 28.4108 16.5242 27.2778 16.5242H25.8791V17.923C25.8791 18.5524 25.6133 19.3217 24.4804 19.3217H23.0816V20.7204C23.0816 21.3499 22.8159 22.1192 21.6829 22.1192H15.5145L10.9266 26.707C10.493 27.1127 10.2412 26.8749 10.0874 26.721L5.90517 22.5528C5.49953 22.1192 5.73732 21.8674 5.89118 21.7135L7.69555 19.8952V14.3002L10.493 11.5028V13.7268C10.493 15.4192 11.612 17.923 14.6892 17.923C17.7664 17.923 18.8854 15.4192 18.8854 13.7268H28.6766V15.1255ZM29.0822 8.53746L26.7044 10.9293H16.088V13.7268C16.088 14.3562 15.8222 15.1255 14.6892 15.1255C13.5562 15.1255 13.2905 14.3562 13.2905 13.7268V9.53056C13.2905 8.88714 13.5283 6.73309 16.088 6.73309H20.8576L24.0468 3.54398C24.4804 3.13834 24.7321 3.37613 24.886 3.52999L29.0682 7.69822C29.4739 8.13183 29.2361 8.3836 29.0822 8.53746Z" fill="var(--primary-color)"/>
    </g>
    <defs>
    <clipPath id="clip0_240_554">
    <rect width="33.5696" height="31.8028" fill="white" transform="translate(0.701874 0.107422)"/>
    </clipPath>
    </defs>
    </svg>
    
  );

  return (
    <div className={`${className} rounded-xl p-6 border border-[var(--primary-color)1F]`}>
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 ${iconClassName} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon || defaultIcon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-md mb-0">{title}</h4>
          <p className="text-gray-600 text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
}
