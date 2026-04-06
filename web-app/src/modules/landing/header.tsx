"use client"
import { Button } from '@/components/Button'
import { UserPlus, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#123c39] py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-white">
                       <img src="https://cdn.prod.website-files.com/632058ecd1d658062bd78397/632063595478cc28e9f033c4_Logo.svg" />

        </div>


        {/* Sign In button */}
        <a
          href="/auth/login"
          className="rounded-md border border-emerald-400 px-4 py-1.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-400 hover:text-[#103633]"
        >
          Sign In
        </a>
      </div>
    </header>
  )
}

export { Header }