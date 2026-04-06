import React from 'react';
import { Mail, User, FileText, BarChart3, MessageSquare, Search } from 'lucide-react';

type ContentType = 'social_post' | 'email' | 'blog' | 'b2b_content' | 'marketing_content' | 'research';

interface SmartMarketingDashboardProps {
  onCardSelect: (contentType: ContentType) => void;
}

const SmartMarketingDashboard: React.FC<SmartMarketingDashboardProps> = ({ onCardSelect }) => {
  const marketingOptions = [
    {
      icon: '/assets/icons/mage_email.png',
      title: "Create an Email",
      color: "text-[var(--primary-color)]",
      contentType: 'email' as ContentType
    },
    {
      icon: '/assets/icons/icon-park-outline_user-business.png',
      title: "Create B2B Content",
      color: "text-[var(--primary-color)]",
      contentType: 'b2b_content' as ContentType
    },
    {
      icon: '/assets/icons/fluent-mdl2_blog.png',
      title: "Create an Blog Post",
      color: "text-[var(--primary-color)]",
      contentType: 'blog' as ContentType
    },
    {
      icon: '/assets/icons/mingcute_content-ai-line.png',
      title: "Marketing Content",
      color: "text-[var(--primary-color)]",
      contentType: 'marketing_content' as ContentType
    },
    {
      icon: '/assets/icons/iconoir_post.png',
      title: "Create Social Post",
      color: "text-[var(--primary-color)]",
      contentType: 'social_post' as ContentType
    },
    {
      icon: '/assets/icons/iconoir_brain-research.png',
      title: "Research Content",
      color: "text-[var(--primary-color)]",
      contentType: 'research' as ContentType
    }
  ];

  const handleCardClick = (contentType: ContentType) => {
    onCardSelect(contentType);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full ">
                <img src="/assets/icons/brand-icon-lg.png" alt="Logo" className="w-auto h-15" />
            </div>
          </div>
          <h1 className="text-4xl font-normal text-gray-900 mb-2">
            Let's Ship Some Smart Marketing.
          </h1>
        </div>

        {/* Marketing Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {marketingOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={index}
                onClick={() => handleCardClick(option.contentType)}
                className="bg-[var(--secondary-color)] rounded-4xl p-8 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100 hover:border-green-200"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-0 p-3 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
                    <img src={`${option.icon}`} className={`w-auto h-14 ${option.color}`} />
                  </div>
                  <h3 className="text-xl font-normal text-[var(--primary-color)] transition-colors duration-200">
                    {option.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-md text-gray-500">
            Cloud Lead can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
export {SmartMarketingDashboard}