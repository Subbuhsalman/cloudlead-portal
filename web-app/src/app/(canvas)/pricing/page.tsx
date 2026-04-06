"use client"
import { PricingPlans } from '@/components/pricing';
import { PricingCards } from '@/modules/pricing/PricingCards';
import React, { useState } from 'react';

export default function Page() {
  const [formData, setFormData] = useState({
    email: 'example@gmail.com',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Handle forgot password here
  };

  return (
    <div className="min-h-screen bg-white   ">

      <div>
        <img src="/assets/landing/logo.png" alt="Cloud Lead Logo" className="w-55 mx-auto mt-8 mb-4" />
      </div>
      <div className="w-full  max-w-6xl mx-auto bg-[#FBFAFF] rounded-3xl py-12 overflow-hidden">
        {/* Header with Logo */}
        {/* Main Content */}
        <PricingPlans />
      </div>

    </div>
  );
}