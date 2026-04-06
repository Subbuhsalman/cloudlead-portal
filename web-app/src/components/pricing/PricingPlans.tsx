'use client';

import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import CheckoutForm from './CheckoutForm';
import { useHttp } from '@/hooks';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  credits_included: number;
  stripe_price_id: string;
  features: Array<{
    feature_id: number;
    feature_name: string;
    description: string;
    credit_cost: number;
    included_usage: number | null;
  }>;
}

const PricingPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = new useHttp()
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response:any = await db.get(`/pricing/plans`);
      setPlans(response?.data?.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load pricing plans');
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
    window.location.href = '/dashboard/subscription';
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  const filteredPlans = plans.filter(plan => plan.billing_cycle === billingCycle);

  // Map backend plans to your UI structure
  const mapPlanToUIFormat = (plan: Plan, index: number) => {
    const planTypes = ['free', 'plus', 'pro'];
    const planType = planTypes[index] || 'pro';
    
    return {
      id: planType,
      name: plan.name,
      price: {
        monthly: plan.billing_cycle === 'monthly' ? plan.price : (plan.price / 12),
        yearly: plan.billing_cycle === 'yearly' ? (plan.price / 12) : plan.price
      },
      description: plan.description,
      features: plan.features.map(f => `${f.feature_name}${f.included_usage ? ` (${f.included_usage} ${billingCycle === 'monthly' ? 'monthly' : 'yearly'})` : ''}`),
      credits: plan.credits_included,
      popular: index === 1, // Make middle plan popular
      originalPlan: plan
    };
  };

  const renderIcon = (id: string) => {
    switch (id) {
      case "free":
        return <img src="/assets/icons/pricing/free-plan.png" className="w-8 h-8" alt="Free Plan" />;
      case "plus":
        return <img src="/assets/icons/pricing/plus-plan.png" className="w-8 h-8" alt="Plus Plan" />;
      case "pro":
        return <img src="/assets/icons/pricing/pro-plan.png" className="w-8 h-8" alt="Pro Plan" />;
      default:
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{id.charAt(0).toUpperCase()}</span>
          </div>
        );
    }
  };

  const getCardClasses = (plan: any) => {
    if (plan.popular) {
      return "bg-[var(--primary-color)]  rounded-3xl px-5 py-8 shadow-2xl transform scale-105 relative";
    }
    return "bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow";
  };

  const getButtonClasses = (plan: any) => {
    if (plan.popular) {
      return "w-full bg-white text-[var(--primary-color)] font-semibold py-3 px-6 rounded-full hover:bg-gray-50 transition-colors";
    }
    return "w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition-colors";
  };

  const getTextClasses = (plan: any) => {
    return plan.popular ? "text-white" : "text-gray-900";
  };

  const getDescriptionClasses = (plan: any) => {
    return plan.popular ? "text-[var(--primary-color)]" : "text-gray-600";
  };

  const getFeatureTextClasses = (plan: any) => {
    return plan.popular ? "text-white" : "text-gray-700";
  };

  const getCurrentPrice = (plan: any) => {
    console.log("plan.price[billingCycle]", plan.price)
    console.log("billingCycle", billingCycle)
    return Math.round(plan.price[billingCycle]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPlans}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showCheckout && selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Elements stripe={stripePromise}>
          <CheckoutForm
            selectedPlan={selectedPlan}
            onSuccess={handleCheckoutSuccess}
            onCancel={handleCheckoutCancel}
          />
        </Elements>
      </div>
    );
  }

  const uiPlans = filteredPlans.map(mapPlanToUIFormat);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600 mb-8">
            Pay for what you generate. No hidden fees, no limits on creativity.
          </p>
          
          {/* Billing Toggle */}
          <div className="border border-[var(--primary-color)] inline-flex rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[var(--primary-color)] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-[var(--primary-color)] text-white shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Billed Annually
              {billingCycle === 'yearly' && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 17%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 lg:px-25 gap-8 items-stretch">
          {uiPlans.map((plan) => (
            <div key={plan.id} className={getCardClasses(plan)}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white text-[var(--primary-color)] px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="w-8 h-8 mb-4">
                  {renderIcon(plan.id)}
                </div>
                <h3 className={`text-xl font-bold ${getTextClasses(plan)}`}>
                  {plan.name}
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-medium ${getTextClasses(plan)}`}>
                    ${getCurrentPrice(plan)}
                  </span>
                  <span className={`text-sm ${getDescriptionClasses(plan)}`}>/ month</span>
                </div>
                <p className={`${getDescriptionClasses(plan)} text-sm mt-2`}>
                  {plan.description}
                </p>
                <p className={`${getDescriptionClasses(plan)} text-sm mt-1`}>
                  {plan.credits.toLocaleString()} credits / {billingCycle === 'monthly' ? 'month' : 'year'}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div>
                      {plan.id !== 'plus' ? (
                        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.54564 12.6996C10.5447 12.6996 12.976 10.2683 12.976 7.26921C12.976 4.27011 10.5447 1.83887 7.54564 1.83887C4.54654 1.83887 2.1153 4.27011 2.1153 7.26921C2.1153 10.2683 4.54654 12.6996 7.54564 12.6996ZM10.062 6.3916C10.3271 6.12652 10.3271 5.69673 10.062 5.43165C9.79691 5.16656 9.36712 5.16656 9.10204 5.43165L6.86685 7.66684L5.98924 6.78923C5.72415 6.52415 5.29437 6.52415 5.02928 6.78923C4.7642 7.05432 4.7642 7.4841 5.02928 7.74919L6.38687 9.10677C6.65195 9.37186 7.08174 9.37186 7.34682 9.10677L10.062 6.3916Z" fill="url(#paint0_linear_14_296)" />
                          <defs>
                            <linearGradient id="paint0_linear_14_296" x1="2.11576" y1="7.26771" x2="12.9752" y2="7.26771" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#8800FF" />
                              <stop offset="1" stopColor="#3305C1" />
                            </linearGradient>
                          </defs>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M7.07689 12.722C10.076 12.722 12.5072 10.2908 12.5072 7.29167C12.5072 4.29258 10.076 1.86133 7.07689 1.86133C4.07779 1.86133 1.64655 4.29258 1.64655 7.29167C1.64655 10.2908 4.07779 12.722 7.07689 12.722ZM9.59325 6.41406C9.85833 6.14898 9.85833 5.71919 9.59325 5.45411C9.32816 5.18902 8.89837 5.18902 8.63329 5.45411L6.3981 7.6893L5.52049 6.81169C5.2554 6.54661 4.82562 6.54661 4.56053 6.81169C4.29545 7.07678 4.29545 7.50656 4.56053 7.77165L5.91812 9.12924C6.1832 9.39432 6.61299 9.39432 6.87807 9.12924L9.59325 6.41406Z" fill="white" />
                        </svg>
                      )}
                    </div>
                    <span className={`${getFeatureTextClasses(plan)} text-xs`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`rounded-full ${getButtonClasses(plan)}`}
                onClick={() => handlePlanSelect(plan.originalPlan)}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;