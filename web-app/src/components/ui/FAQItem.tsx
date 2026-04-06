'use client'
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function FAQItem({ 
  question, 
  answer, 
  isExpanded = false, 
  onToggle 
}: FAQItemProps) {
  const [expanded, setExpanded] = useState(isExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle?.();
  };

  return (
    <div className="border-b border-gray-200 py-3 last:border-b-0">
      <button 
        onClick={handleToggle}
        className="flex justify-between items-center w-full text-left group py-2"
      >
        <span className="font-medium text-gray-900 group-hover:text-[var(--primary-color)] transition-colors text-base leading-relaxed pr-4">
          {question}
        </span>
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 hover:bg-green-200 transition-colors">
          {expanded ? (
            <Minus className="w-4 h-4 text-[var(--primary-color)]" />
          ) : (
            <Plus className="w-4 h-4 text-[var(--primary-color)]" />
          )}
        </div>
      </button>
      {(expanded && answer) && (
        <div className="mt-4 text-gray-600 text-sm leading-relaxed pl-0">
          {answer}
        </div>
      )}
    </div>
  );
}
