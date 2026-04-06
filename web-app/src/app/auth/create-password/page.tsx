"use client"
import { Button } from '@/components/Button';
import { useToast } from '@/components/ToastProvider';
import { useHttp } from '@/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function ShippingMindsSignup() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const code = searchParams.get('code') || '';

  const guid = searchParams.get('guid') || '';
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password requirements if it's the password field
    if (name === 'password') {
      checkPasswordRequirements(value);
    }
  };

  const checkPasswordRequirements = (password: any) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleContinue = () => {
    if (formData.password === formData.confirmPassword &&
      Object.values(passwordRequirements).every(req => req)) {
      console.log('Password created successfully');
      // Handle password creation logic here

      const db = new useHttp();
      db.post('/auth/create-password', { guid, code: code, password: formData.password })
        .then((response: any) => {
          const { success, message } = response.data;
          if (success) {
            toast.success('Verification successful! Redirecting to login...');
            router.push('/auth/login');
          }
          else {
            toast.error(message || 'Verification failed. Please try again.');
          }
          console.log('Code resent successfully:', response);
        })
        .catch((error: any) => {
          console.error('Error resending code:', error);
        }).finally(() => {
          setLoading(false);
        }
        );
    }
  };

  const isFormValid = formData.password === formData.confirmPassword &&
    Object.values(passwordRequirements).every(req => req);

  return (
    <div className="min-h-screen bg-white   ">

      <div>
        <img src="/assets/landing/logo.png" alt="Cloud Lead Logo" className="sm:w-10 lg:w-60 mx-auto mt-8 mb-4" />
      </div>
      <div className="w-full  max-w-6xl mx-auto bg-[#FBFAFF] rounded-3xl py-12 overflow-hidden">
        {/* Header with Logo */}


        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 px-8 ">
          {/* Left Column - Form */}
          <div className="flex flex-col justify-center max-w-md mx-auto w-full">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Create Password
              </h1>
              <p className="text-gray-500 text-md">
                Create a strong password to protect your workspace.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
                />
              </div>

              {/* Password Requirements */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">Your password must include:</p>
                <ul className="space-y-2">
                  <li className={`text-sm flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">•</span>
                    At least 8 characters
                  </li>
                  <li className={`text-sm flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">•</span>
                    One uppercase letter
                  </li>
                  <li className={`text-sm flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">•</span>
                    One number
                  </li>
                  <li className={`text-sm flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">•</span>
                    One special character (e.g. ! @ # *)
                  </li>
                </ul>
              </div>
 <Button
                onClick={handleContinue}
                disabled={!isFormValid}
                variant="primary"
                size="lg"
                className='w-full '

              >
                Sign In
              </Button>

            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex items-center justify-center">
            <div className="relative max-w-lg w-full">
              <img src="/assets/icons/phone-validation.svg" alt="Signup Image" className="w-md h-auto mx-auto rounded-3xl shadow-lg" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}