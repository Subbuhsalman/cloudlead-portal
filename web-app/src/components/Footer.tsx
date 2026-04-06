"use client"
import React from 'react'
import AppStoreBadge from './ui/AppStoreBadge'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Linkedin, Twitter, Facebook } from 'lucide-react';
const Footer = () => {
  const router = useRouter();
  return (
    <footer className="w-full bg-[#071821] text-gray-200">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-1 items-start justify-between gap-10 md:grid-cols-2">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 text-white">
             <img src="https://cdn.prod.website-files.com/632058ecd1d658062bd78397/632063595478cc28e9f033c4_Logo.svg" />
            </div>


            <h3 className="mt-6 text-lg font-semibold text-white">
              Human Verified Data At Scale
            </h3>


            <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
              Cloudlead harmonizes the power of both software and human researchers to build custom lists. We love helping our clients grow with the power of custom, human verified data at scale.
            </p>
          </div>


          {/* Right */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Social Media
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/cloudlead/"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 hover:bg-emerald-500"
              >
                <Linkedin className="h-4 w-4 text-white" />
              </a>
              <a
                href="https://twitter.com/cloudleadco?lang=en"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 hover:bg-emerald-500"
              >
                <Twitter className="h-4 w-4 text-white" />
              </a>
              <a
                href="https://www.facebook.com/Cloudleadco/"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 hover:bg-emerald-500"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>
        </div>


        {/* Divider */}
        <div className="my-10 h-px w-full bg-gray-700/60" />


        {/* Copyright */}
        <p className="text-center text-xs text-gray-400">
          © Copyrights 2022 Cloudlead.co - All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export { Footer }