import React from 'react';
import Image from 'next/image';

interface AppStoreBadgeProps {
  type: 'apple' | 'google';
  className?: string;
}

export default function AppStoreBadge({ type, className = "" }: AppStoreBadgeProps) {
  if (type === 'apple') {
    return (
      <Image src="/assets/icons/app-store.png" alt="Google Play" width={150} height={100} />
    );
  }

  if (type === 'google') {
    return (
      <Image src="/assets/icons/google-playsore.png" alt="Google Play" width={150} height={100} />
    );
  }

  return null;
}
