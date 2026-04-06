'use client';
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useHttp } from '@/hooks';
interface Plan {
      id: number;
      name: string;
      description: string;
      price: number;
      billing_cycle: 'monthly' | 'yearly';
      credits_included: number;
      stripe_price_id: string;

}
interface CheckoutFormProps {
      selectedPlan: Plan;
      onSuccess: () => void;
      onCancel: () => void;

}
const CheckoutForm: React.FC<CheckoutFormProps> = ({ selectedPlan, onSuccess, onCancel }) => {
      const stripe = useStripe();
      const elements = useElements();
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);
        setError(null);

        try {
          // Get auth token from localStorage/cookies
        const db = new useHttp()
      // Create subscription
      const response:any = await db.post('/pricing/subscribe',{
        planId: selectedPlan.id
      })
      console.log("response", response)
      const { clientSecret, subscriptionId } = response.data.data;
      
      // Confirm payment
      console.log("clientSecret",clientSecret)
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });
      
      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setIsLoading(false);
        return;
      }
      
      // Confirm subscription on backend
     await db.post('/pricing/confirm-subscription',{
        subscriptionId
      })
      
      onSuccess();
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6 text-center pb-4 border-b">
        <h3 className="text-xl font-bold text-gray-900">Complete Your Subscription</h3>
        <p className="text-gray-600 mt-1">
          Plan: {selectedPlan.name} - ${selectedPlan.price}/{selectedPlan.billing_cycle}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4 p-3 border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={isLoading}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={!stripe || isLoading}
            className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : `Subscribe for $${selectedPlan.price}`}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CheckoutForm;