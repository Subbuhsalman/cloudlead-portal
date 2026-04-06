'use client';
import React from 'react';
interface UsageHistory {
      id: number;
      feature_name: string;
      credits_used: number;
      description: string;
      created_at: string;

}
interface UsageHistoryProps {
      history: UsageHistory[];

}
const UsageHistoryCard: React.FC<UsageHistoryProps> = ({ history }) => {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Usage</h3>

          {history.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No usage history yet.</p>

      ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((usage) => (
                <div key={usage.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{usage.feature_name}</p>
                    <p className="text-sm text-gray-600">{usage.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(usage.created_at).toLocaleDateString()} at{' '}
                      {new Date(usage.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">-{usage.credits_used} credits</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };
    export default UsageHistoryCard;