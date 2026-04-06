"use client"
import { useHttp, useLoginDetails } from '@/hooks';
import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useToast } from '@/components/ToastProvider';

export default function ShippingMindsSignup() {

  const db = new useHttp();
  const { registerUserHook, authLoading } = useLoginDetails();
            const toast = useToast();

  const router = useRouter()
  const showMessage = (severity: string, summary: string, detail: string) => {
    // msgs.current?.replace({
    //   severity,
    //   summary,
    //   detail,
    //   closable: true,
    //   sticky: true
    // });
  };

  const formik: any = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validate: values => {
      const errors: Record<string, string> = {};
      if (!values.name) {
        errors.name = 'Name is required.';
      }
      if (!values.email) {
        errors.email = 'Email is required.';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address.';
      }
      return errors;
    },
    onSubmit: async values => {
      try {
        // adjust endpoint as needed
        const onSuccess = (response: any) => {
          toast.success('Registration successful! Please check your email for verification.');
          router.push(`/auth/verification?guid=${response.otp}&email=${response.user.email}`);
        }
        registerUserHook(values, onSuccess)

      } catch (err: any) {
        showMessage('error', 'Registration Failed', err?.response?.data?.message || err.message);
      }
    }
  });

  const isFieldInvalid = (field: string) =>
    !!(formik.touched[field] && formik.errors[field]);

  const getErrorMsg = (field: string) =>
    isFieldInvalid(field) && <small className="block text-red-500">{formik.errors[field]}</small>;

  const [formData, setFormData] = useState({
    name: 'i.e. Davon Lean',
    email: 'i.e. davon@mail.com',
    rememberMe: false
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
  };

  console.log("authLoading",authLoading)
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
                Join us today 👋
              </h1>
              <p className="text-gray-500 text-lg">
                Your AI-Powered Marketing Brain Starts Here
              </p>
            </div>


            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First & Last Name
                </label>
                <input
                  type="text"
                  name="name"
                  id='name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-500"
                />
                {getErrorMsg('name')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id='email'
                  name="email"

                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-500"
                />
                {getErrorMsg('email')}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[var(--primary-color)] bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <Button
                loading={authLoading}
                onClick={formik.handleSubmit}
                variant="primary"
                size='lg'
                className="w-full bg-[var(--primary-color)]"
              >
                Create Account
              </Button>
            </div>

            {/* Login Link */}
            <p className="mt-6 text-left text-sm text-gray-600">
              Already have an Account?{' '}
              <a href="/auth/login" className="text-[var(--primary-color)]  cursor-pointer hover:text-[var(--primary-color)] font-medium">
                Login
              </a>
            </p>
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