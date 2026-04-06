 const IndustrySelector = ({formData, handleIndustryRadioChange, loading, customIndustry, handleCustomIndustryChange}) => {
    const industries = [
      { value: 'logistics', label: 'Logistics' },
      { value: 'saas', label: 'SaaS' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'finance', label: 'Finance' },
      { value: 'retail', label: 'Retail' }
    ];
    
    return (
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Industry Context:
        </label>
        <div className="grid grid-cols-3 gap-3">
          {industries.map((industry) => (
            <label key={industry.value} className="flex items-center p-3 border border-[var(--primary-color)6E] rounded-lg cursor-pointer hover:bg-green-50 transition-colors duration-200">
              <input
                type="radio"
                name="industryContext"
                value={industry.value}
                checked={formData?.industryContext === industry.value}
                onChange={(e) => handleIndustryRadioChange(e.target.value)}
                className="w-4 h-4 text-[var(--primary-color)] focus:ring-green-500 border-gray-300"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700 font-medium">{industry.label}</span>
            </label>
          ))}
        </div>
        
        {/* Custom Industry Input - FIXED VERSION */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Or specify custom industry..."
            value={customIndustry}
            onChange={(e) => handleCustomIndustryChange(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--primary-color)6E] shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            disabled={loading}
          />
        </div>
      </div>
    );
  };

  export { IndustrySelector }