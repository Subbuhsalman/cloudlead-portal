"use client"
import { Button } from '@/components/Button';
import { useToast } from '@/components/ToastProvider';
import { useHttp } from '@/hooks';
import { maskEmail } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState, Suspense } from 'react';

function VerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const guid = searchParams.get('guid') || '';
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const toast = useToast();
  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index:number, value:string) => {
    // Only allow single digit
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index:number, e:any) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e:any) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 5);
    const newCode = [...code];

    for (let i = 0; i < pasteData.length && i < 5; i++) {
      if (/\d/.test(pasteData[i])) {
        newCode[i] = pasteData[i];
      }
    }

    setCode(newCode);

    // Focus the next empty input or last input
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 4 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleContinue = () => {
    const fullCode = code.join('');
    if (fullCode.length === 5) {
      setLoading(true);
      const db = new useHttp();
      db.post('/auth/verify-verification-code', { guid, code:fullCode })
        .then((response: any) => {
          const { success, message } = response.data;
          if(success){
            toast.success('Verification successful! Redirecting to login...');
            router.push('/auth/create-password?guid=' + guid + '&email=' + email+ '&code=' + fullCode);
          }
          else{
            toast.error(message || 'Verification failed. Please try again.');
          }
          console.log('Code resent successfully:', response);
        })
        .catch((error: any) => {
          console.error('Error resending code:', error);
        }).finally(() => {
          setLoading(false) ;
        }
      );
      // Handle verification logic here
    }
  };

  const handleResendCode = () => {
    console.log('Resending verification code...');
    // Handle resend logic here
    const db = new useHttp();
    db.post('/auth/resend-verification-code', { guid, email })
      .then((response: any) => {
        console.log('Code resent successfully:', response);
      })
      .catch((error: any) => {
        console.error('Error resending code:', error);
      });
    setCode(['', '', '', '', '']);
    inputRefs.current[0]?.focus();


  };

  const isCodeComplete = code.every(digit => digit !== '');

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
                Verification
              </h1>
              <p className="text-gray-600 leading-relaxed font-light">
                We've sent a 4-character code to{' '}<span className="font-semibold text-gray-600">{maskEmail(email)}</span>.
                The code expires shortly, so please enter it soon. 5-digit
                confirmation code
              </p>
            </div>

            {/* Code Input */}
            <div className="mb-8">
              <div className="flex justify-start space-x-3 mb-6">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-16 h-16 text-center text-2xl font-semibold border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 outline-none transition-all duration-200 bg-white"
                    placeholder=""
                  />
                ))}
              </div>

              {/* Resend Code Link */}
              <div className="text-left">
                <span className="text-gray-600">Didn't receive the code? </span>
                <button
                  onClick={handleResendCode}
                  className="text-[var(--primary-color)] hover:text-green-700 font-medium hover:underline focus:outline-none focus:underline"
                >
                  Resend Code
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              loading={loading}
              disabled={!isCodeComplete}
              variant="primary"
              size="lg"
            >
              Continue
            </Button>
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
    </div>
  );
}

export default function ShippingMindsSignup() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerificationContent />
    </Suspense>
  );
}