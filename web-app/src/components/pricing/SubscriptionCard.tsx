'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useHttp } from '@/hooks';
interface Subscription {
      id: number;
      plan_name: string;
      status: string;
      billing_cycle: string;
      current_period_end: string;
      credits_included: number;

}
interface SubscriptionCardProps {
      subscription: Subscription | null;
      onRefresh: () => void;

}
const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onRefresh }) => {
      const [isLoading, setIsLoading] = useState(false);
                  const db = new useHttp();

      const handleManageBilling = async () => {
        setIsLoading(true);
        try {
          const response:any = await db.post(
            `/pricing/billing-portal`,
            { returnUrl: window.location.href }            
      );
      window.location.href = response.data.data.url;
    } catch (error) {
          console.error('Error opening billing portal:', error);
          alert('Failed to open billing portal. Please try again.');
          setIsLoading(false);

    }
  };
  const handleCancelSubscription = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription?')) {
          return;

    }
    setIsLoading(true);
    try {
          await db.post(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/pricing/cancel`,
            {}
      );
      onRefresh();
      alert('Subscription canceled successfully.');
    } catch (error) {
          console.error('Error canceling subscription:', error);
          alert('Failed to cancel subscription. Please try again.');

    }
    setIsLoading(false);
  };
  if (!subscription) {
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">No Active Subscription</h3>
            <p className="text-gray-600 mb-4">You don't have an active subscription. Choose a plan to get started.</p>
            <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              onClick={() => window.location.href = '/dashboard/pricing'}
        >
              View Pricing Plans
        </button>
      </div>
    );
  }
  return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium text-gray-900">{subscription.plan_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                subscription.status === 'active' ? 'text-green-600' : 
                subscription.status === 'canceled' ? 'text-red-600' : 'text-yellow-600'

          }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Billing Cycle:</span>
          <span className="font-medium text-gray-900">{subscription.billing_cycle}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Next Billing:</span>
          <span className="font-medium text-gray-900">
            {new Date(subscription.current_period_end).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={handleManageBilling}
          disabled={isLoading}
        >
              {isLoading ? 'Loading...' : 'Manage Billing'}
        </button>
        {subscription.status === 'active' && (
              <button 
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                onClick={handleCancelSubscription}
                disabled={isLoading}
              >
                Cancel Subscription
          </button>

        )}
      </div>
    </div>
  );
};
export default SubscriptionCard;