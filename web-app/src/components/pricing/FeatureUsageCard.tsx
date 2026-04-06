'use client';
import { useHttp } from '@/hooks';
import { set } from 'lodash';
import React, { useEffect, useState } from 'react';
interface FeatureUsageProps {
  onUseFeature: (featureId: number, creditsToUse: number, description: string) => Promise<void>;
  remainingCredits: number;
}
const FeatureUsageCard: React.FC<FeatureUsageProps> = ({ onUseFeature, remainingCredits }) => {
  const [selectedFeature, setSelectedFeature] = useState('');
  const [creditsToUse, setCreditsToUse] = useState(1);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [features, setfeatures] = useState([])
  const getFeatures = async () => {
    const db = new useHttp();
    const _features:any = await db.get('/pricing/features');
    setfeatures(_features?.data?.data || [])
  }
  useEffect(() => {
    getFeatures()
  
    return () => {}
  }, [])
  
  // const features = [
  //   { id: 1, name: 'API Call', credit_cost: 1 },
  //   { id: 2, name: 'Data Export', credit_cost: 5 },
  //   { id: 3, name: 'Advanced Analytics', credit_cost: 10 },
  //   { id: 4, name: 'Custom Integration', credit_cost: 25 }
  // ];
  const handleUseFeature = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFeature || creditsToUse < 1) return;

    const feature = features.find(f => f.id === parseInt(selectedFeature));
    if (!feature) return;

    const totalcredit_cost = feature.credit_cost * creditsToUse;

    if (totalcredit_cost > remainingCredits) {
      alert('Insufficient credits for this operation.');
      return;
    }
    setIsLoading(true);
    try {
      await onUseFeature(
        parseInt(selectedFeature), 
        totalcredit_cost, 
        description || `Used ${feature.name}`
      );
      setSelectedFeature('');
      setCreditsToUse(1);
      setDescription('');
    } catch (error) {
      console.error('Error using feature:', error);
    }
    setIsLoading(false);
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Use Features</h3>

      <form onSubmit={handleUseFeature} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Feature:</label>
          <select 
            value={selectedFeature} 
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose a feature...</option>
            {features.map(feature => (
              <option key={feature.id} value={feature.id}>
                {feature.name} ({feature.credit_cost} credits)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
          <input
            type="number"
            min="1"
            value={creditsToUse}
            onChange={(e) => setCreditsToUse(parseInt(e.target.value) || 1)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional):</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of usage..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {selectedFeature && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Total credit_cost: <span className="font-semibold">
                {(features.find(f => f.id === parseInt(selectedFeature))?.credit_cost || 0) * creditsToUse} credits
              </span>
            </p>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFeature || isLoading || remainingCredits === 0}
        >
          {isLoading ? 'Processing...' : 'Use Feature'}
        </button>
      </form>
    </div>
  );
};
export default FeatureUsageCard;

