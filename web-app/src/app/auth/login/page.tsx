"use client"
import { useLoginDetails, useHttp } from '@/hooks';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { isEmpty } from "lodash";
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { dashboardHome } from '@/utils/menuItem';

export default function ShippingMindsSignup() {

  const { loginUser, userDetail, checkValidLoginRoute } = useLoginDetails();
  const { loading, error } = userDetail;
  const msgs = useRef<any>(null);
  const router = useRouter();


  const formik: any = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (data) => {
      let errors: any = {};

      if (!data.email) {
        errors.email = ' email is required.';
      } else {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formik.values.email)) {
          errors.email = 'Invalid email';
        }
      }

      if (!data.password) {
        errors.password = 'Password is required.';
      }

      return errors;
    },
    onSubmit: (data) => {
      login(data);
    }
  });

  const isFormFieldValid = (name: any) => {
    return !!(formik.touched[name] && formik.errors[name]);
  };
  const getFormErrorMessage = (name: any) => {
    return isFormFieldValid(name) && <small className="block text-red-500 font-semibold">{formik.errors[name]}</small>;
  };

  const login = (data: any) => {
    loginUser({
      username: data.email,
      password: data.password
    })
  };


  React.useEffect(() => {
    if (loading === false && !isEmpty(error)) {
      showMessage('error', 'Error!', error);
    }
  }, [userDetail]);

  useEffect(() => {

    if (userDetail?.isLoggedIn === true) {
      router.push(dashboardHome)
    }
    else {
      checkValidLoginRoute()
    }

    return () => {
    }
  }, [userDetail])

  const showMessage = (severity: string, summary: string, detail: string) => {
    msgs.current?.replace({
      severity: severity,
      summary: summary,
      detail: detail,
      closable: true,
      sticky: true
    });
  };

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


  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Handle forgot password here
  };

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
                Welcome back 
              </h1>
              <p className="text-gray-500 text-lg">
                Access your Lead Enrichment Dashboard
              </p>
            </div>

         

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
                />
                {getFormErrorMessage('email')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id='password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
                />
                {getFormErrorMessage('password')}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[var(--primary-color)] bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                <button
                  onClick={handleForgotPassword}
                  className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-color)] font-medium hover:underline focus:outline-none focus:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                onClick={formik.handleSubmit}
                loading={loading}
                variant="primary"
                size="lg"
                className='w-full '

              >
                Sign In
              </Button>
            </div>

            {/* Login Link */}
            <p className="mt-6 text-left text-sm text-gray-600">
              Don't have an account?{' '}
              <a onClick={() => { router.push("/auth/register") }} className="text-[var(--primary-color)] cursor-pointer font-medium">
                Create free account
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