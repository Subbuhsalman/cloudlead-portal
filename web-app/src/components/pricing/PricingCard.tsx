'use client';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
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
interface PricingCardProps {
      plan: Plan;
      onSelect: (plan: Plan) => void;
      isSelected: boolean;
      isLoading: boolean;

}
const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect, isSelected, isLoading }) => {
      const isYearly = plan.billing_cycle === 'yearly';
      const monthlyPrice = isYearly ? (plan.price / 12) : plan.price;
      const savings = isYearly ? ((plan.price / 12) * 14 - plan.price) : '0';
      return (
        <div className={`bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
          isSelected ? 'border-blue-500 shadow-lg transform -translate-y-1' : 'border-gray-200'

    }`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <p className="text-gray-600">{plan.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-sm text-gray-500">$</span>
              <span className="text-4xl font-bold text-gray-900">{monthlyPrice}</span>
              <span className="text-sm text-gray-500 ml-1">/month</span>
            </div>
            {isYearly && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Billed yearly (${plan.price})</p>
            <p className="text-sm text-green-600 font-semibold">Save ${savings}!</p>
          </div>
        )}
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
        <h4 className="text-lg font-semibold text-blue-600">
          {plan.credits_included.toLocaleString()} Credits
        </h4>
        <p className="text-sm text-gray-600">{isYearly ? 'Per year' : 'Per month'}</p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
        <ul className="space-y-2">
          {plan.features.map((feature) => (
                <li key={feature.feature_id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-700 font-medium">{feature.feature_name}</span>
                  {feature.included_usage && (
                    <span className="text-sm text-gray-500">
                      ({feature.included_usage} {isYearly ? 'yearly' : 'monthly'})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              isSelected 
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'

        } disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={() => onSelect(plan)}
        disabled={isLoading}
      >
            {isLoading ? 'Processing...' : isSelected ? 'Selected' : 'Select Plan'}
      </button>
    </div>
  );
};
export default PricingCard;