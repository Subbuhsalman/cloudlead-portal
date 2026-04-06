'use client';
import React from 'react';
interface Credit {
      id: number;
      total_credits: number;
      used_credits: number;
      remaining_credits: number;
      expires_at: string;
      plan_name: string;

}
interface CreditUsageCardProps {
      credits: Credit[];
      totalCredits: number;

}
const CreditUsageCard: React.FC<CreditUsageCardProps> = ({ credits, totalCredits }) => {
      const usedCredits = credits.reduce((sum, credit) => sum + credit.used_credits, 0);
      const usagePercentage = totalCredits > 0 ? ((usedCredits / (usedCredits + totalCredits)) * 100).toFixed(1) : '0';
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Usage</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Remaining Credits</p>
              <p className="text-2xl font-bold text-blue-600">{totalCredits.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Used Credits</p>
          <p className="text-2xl font-bold text-gray-600">{usedCredits.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Usage Progress</span>
          <span className="text-sm text-gray-600">{usagePercentage}% used</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {credits.map((credit) => (
              <div key={credit.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{credit.plan_name}</p>
                  <p className="text-sm text-gray-600">
                    Expires: {new Date(credit.expires_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {credit.remaining_credits.toLocaleString()} / {credit.total_credits.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CreditUsageCard;