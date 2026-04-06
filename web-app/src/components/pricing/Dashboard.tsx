'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubscriptionCard from './SubscriptionCard';
import CreditUsageCard from './CreditUsageCard';
import FeatureUsageCard from './FeatureUsageCard';
import UsageHistoryCard from './UsageHistoryCard';
import { useHttp, useLoginDetails } from '@/hooks';
interface Subscription {
      id: number;
      plan_name: string;
      status: string;
      billing_cycle: string;
      current_period_end: string;
      credits_included: number;

}
interface Credit {
      id: number;
      total_credits: number;
      used_credits: number;
      remaining_credits: number;
      expires_at: string;
      plan_name: string;

}
interface UsageHistory {
      id: number;
      feature_name: string;
      credits_used: number;
      description: string;
      created_at: string;

}
interface DashboardData {
      subscription: Subscription | null;
      credits: Credit[];
      totalCredits: number;

}
const Dashboard: React.FC = () => {
      const [subscriptionData, setSubscriptionData] = useState<DashboardData | null>(null);
      const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      useEffect(() => {
        fetchDashboardData();

  }, []);
  const db = new useHttp();
  const fetchDashboardData = async () => {
        try {
        const token = "dfsgdsg";
          if (!token) {
            setError('Please log in to view your dashboard');
            setLoading(false);
            return;

      }
      const [subscriptionResponse, historyResponse]:any = await Promise.all([
            db.get(`/pricing/subscription`),
            db.get(`/pricing/usage-history?limit=10`)

      ]);

      setSubscriptionData(subscriptionResponse?.data?.data);
      setUsageHistory(historyResponse?.data?.data);
      setLoading(false);
    } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load dashboard data');
          setLoading(false);

    }
  };
  const handleUseFeature = async (featureId: number, creditsToUse: number, description: string) => {
        try {
          await db.post(
            `/pricing/use-credits`,
            { featureId, creditsToUse, description }       

      );

      // Refresh dashboard data
      fetchDashboardData();
      alert('Feature used successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to use feature');
      throw error;
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  if (!subscriptionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No subscription data available</p>
      </div>
    );
  }
  const { subscription, credits, totalCredits } = subscriptionData;
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Dashboard</h1>
          <p className="text-gray-600">Manage your subscription and monitor your credit usage</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <SubscriptionCard 
              subscription={subscription}
              onRefresh={fetchDashboardData}
            />
            
            <CreditUsageCard 
              credits={credits}
              totalCredits={totalCredits}
            />
          </div>
          <div className="space-y-8">
            <FeatureUsageCard 
              onUseFeature={handleUseFeature}
              remainingCredits={totalCredits}
            />
            
            <UsageHistoryCard history={usageHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;