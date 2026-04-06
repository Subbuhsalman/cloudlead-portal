const FormField = ({ 
  label, 
  placeholder, 
  field, 
  handleInputChange, 
  loading, 
  value, 
  required = false 
}: {
  value: string;
  loading: boolean;
  label: string;
  placeholder: string;
  field: string;
  handleInputChange: any;
  required?: boolean;
}) => (
  <div className="mb-6">
    <label className="block text-lg font-semibold text-gray-900 mb-3">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => handleInputChange(field, e.target.value)}
      className={`w-full px-4 py-3 border shadow-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 ${
        required && !value ? 'border-red-300 border-2' : 'border-[var(--primary-color)6E]'
      }`}
      disabled={loading}
      required={required}
    />
    {required && !value && (
      <p className="text-red-500 text-sm mt-1">This field is required</p>
    )}
  </div>
);

export { FormField };
