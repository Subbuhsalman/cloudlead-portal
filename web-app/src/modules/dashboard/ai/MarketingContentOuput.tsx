"use client";
import React, { useState } from 'react';
import { Copy, Sparkles, CheckCircle } from 'lucide-react';

interface ApiResponse {
  success: boolean;
  data: {
    content: string;
    visualAssets?: any[];
    metadata?: {
      contentType: string;
      platform?: string;
      timestamp: string;
    };
  };
  message?: string;
}

type ContentType = 'social_post' | 'email' | 'blog' | 'b2b_content' | 'marketing_content' | 'research';

interface MarketingContentOutputProps {
  response: ApiResponse | null;
  onChangePrompt: () => void;
  onStartOver: () => void;
  contentType: ContentType | null;
  selectedPlatform?: string; // Add platform prop for social posts
}

const MarketingContentOutput: React.FC<MarketingContentOutputProps> = ({
  response,
  onChangePrompt,
  onStartOver,
  contentType,
  selectedPlatform
}) => {
  const [copied, setCopied] = useState(false);

  // Function to generate dynamic header text based on content type and platform
  const getHeaderText = (contentType: ContentType | null, platform?: string): string => {
    if (!contentType) return "Here's Your Generated Content:";

    switch (contentType) {
      case 'social_post':
        if (platform) {
          switch (platform.toLowerCase()) {
            case 'instagram':
              return "Here's An Instagram Post Caption:";
            case 'facebook':
              return "Here's A Facebook Post Caption:";
            case 'twitter':
              return "Here's A Twitter Post:";
            case 'linkedin':
              return "Here's A LinkedIn Post:";
            default:
              return `Here's A ${platform} Post:`;
          }
        }
        return "Here's A Social Media Post:";
      
      case 'email':
        return "Here's Your Email Content:";
      
      case 'blog':
        return "Here's Your Blog Post:";
      
      case 'b2b_content':
        return "Here's Your B2B Content:";
      
      case 'marketing_content':
        return "Here's Your Marketing Content:";
      
      case 'research':
        return "Here's Your Research Content:";
      
      default:
        return "Here's Your Generated Content:";
    }
  };

  // Function to get platform-specific or content-specific output label
  const getOutputLabel = (contentType: ContentType | null, platform?: string): string => {
    if (!contentType) return "AI-Generated Output";

    switch (contentType) {
      case 'social_post':
        if (platform) {
          return `${platform} Post Content`;
        }
        return "Social Media Post";
      
      case 'email':
        return "Email Content";
      
      case 'blog':
        return "Blog Post Content";
      
      case 'b2b_content':
        return "B2B Content";
      
      case 'marketing_content':
        return "Marketing Content";
      
      case 'research':
        return "Research Content";
      
      default:
        return "AI-Generated Content";
    }
  };

  const handleCopyToClipboard = async () => {
    const content = response?.data?.content || ``;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Get platform from response metadata or props
  const platform = selectedPlatform || response?.data?.metadata?.platform;

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl  pt-2 mb-6">
          <div className="flex items-start gap-3 mb-6 border-b border-gray-200 pb-4">
            <div className="w-8 h-8 bg-[var(--primary-color)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-normal mt-[5px] text-gray-900">
                Sure! {getHeaderText(contentType, platform)}
              </h2>
            </div>
          </div>
          <div className='px-8'>
          {/* AI Generated Content */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{getOutputLabel(contentType, platform)}</h3>
            <div 
              className="bg-gray-50 rounded-lg p-4 border-l-4 border-[var(--primary-color)]"
              dangerouslySetInnerHTML={{ __html: (response?.data?.content || ``).replace(/\n/g, '<br/>') }} 
            />
          </div>

          {/* Content Metadata */}
          {(contentType || platform) && (
            <div className="mb-6 text-sm text-gray-600">
              <div className="flex flex-wrap gap-4">
                {contentType && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800">
                    Type: {contentType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                )}
                {platform && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800">
                    Platform: {platform}
                  </span>
                )}
                {response?.data?.metadata?.timestamp && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-800">
                    Generated: {new Date(response.data.metadata.timestamp).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )}
          <p className="text-sm text-gray-600 my-8">
            If you want to make any changes use change prompt button below.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <button 
              onClick={onChangePrompt}
              className="px-6 py-3 bg-green-100 text-[var(--primary-color)] font-semibold rounded-lg hover:bg-green-200 transition-colors duration-200"
            >
              Change Prompt
            </button>
            <button 
              onClick={handleCopyToClipboard}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 justify-center ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-[var(--primary-color)] text-white hover:bg-green-700'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  Copy to Clipboard
                  <Copy className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
        
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Cloud Lead can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
export {MarketingContentOutput}