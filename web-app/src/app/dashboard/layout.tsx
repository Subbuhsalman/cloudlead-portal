"use client"
import React, { useEffect, useRef, useState } from 'react';
import {
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { useHttp, useLoginDetails } from '@/hooks';
import { ProfileMenu } from '@/components/ProfileMenu';
import { useRouter } from 'next/navigation';

const Dashboard = ({ children }: any) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { addUserInfo, userDetail } = useLoginDetails();
  const router = useRouter()
  const [subscriptionData, setSubscriptionData] = useState<any | null>(null);

  useEffect(() => {
    addUserInfo()
    fetchDashboardData()
    return () => { }
  }, [])

  const fetchDashboardData = async () => {
    // Fetch and set dashboard data here
    const db = new useHttp();
    const [subscriptionResponse]: any = await Promise.all([
      db.get(`/pricing/subscription`),
    ]);

    setSubscriptionData(subscriptionResponse?.data?.data);
  };

  const navigationData = [
    
    {
      id: 'files',
      label: 'File Management',
      path: '/dashboard/files',
      icon: 'image', // For custom image
      imageSrc: '/assets/icons/csv-file.png',
      isActive: true,
      className: 'bg-green-100',
      textColor: 'text-sm font-medium'
    },
   
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-70'} bg-[var(--secondary-color)] border-r border-green-100 transition-all duration-300 flex flex-col hidden lg:flex`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-green-100">
          <div className="flex items-center gap-2">
            <img onClick={() => setSidebarCollapsed(!sidebarCollapsed)} src="/assets/icons/logo.PNG" alt="Logo" className="w-auto h-12 cursor-pointer" />
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-green-100 rounded p-1"
          >
            {sidebarCollapsed ? <></> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L12 12M12 12H15.75M12 12V8.25" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 18C2 16.114 2 15.172 2.586 14.586C3.172 14 4.114 14 6 14C7.886 14 8.828 14 9.414 14.586C10 15.172 10 16.114 10 18C10 19.886 10 20.828 9.414 21.414C8.828 22 7.886 22 6 22C4.114 22 3.172 22 2.586 21.414C2 20.828 2 19.886 2 18Z" stroke="#3D3D3D" strokeWidth="1.5" />
              <path d="M12 2C16.714 2 19.071 2 20.535 3.464C22 4.93 22 7.286 22 12C22 16.714 22 19.071 20.535 20.535C19.178 21.894 17.055 21.993 13 22M2 11C2.008 6.945 2.107 4.822 3.464 3.464C4.438 2.491 5.807 2.164 8 2.055" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            }
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-6 pt-8">
          <nav className="space-y-2">
            {navigationData?.map(item => {
              const base =
                "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer";
              const active = item?.isActive ? "bg-green-100" : "";
              const collapsed = sidebarCollapsed
                ? "justify-center gap-0"
                : "";

              return (
                <div
                  key={`nav-item-${item.id}`}
                  className={`${base} ${active} ${collapsed}`}
                  onClick={() => handleNavigation(item?.path)}
                >
                  <img src={item?.imageSrc} alt={item?.label} className="h-6 w-auto" />
                  {!sidebarCollapsed && (
                    <p className="text-sm">{item?.label}</p>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-green-100">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">M</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{subscriptionData?.subscription?.PricingPlan?.name}</div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active {subscriptionData?.totalCredits} Credits
                </div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-[var(--primary-color)] rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-medium text-xs">M</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-[var(--secondary-color)] border-r border-green-100 transform transition-transform duration-300 ease-in-out">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-green-100">
              <div className="flex items-center gap-2">
                <img src="/assets/icons/brand-icon-lg.png" alt="Logo" className="w-auto h-10" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-green-100 rounded"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 p-4 space-y-6 pt-8">
              <nav className="space-y-2">
                {navigationData?.map(item => (
                  <div
                    key={`mobile-nav-item-${item.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${item?.isActive ? "bg-green-100" : "hover:bg-green-50"}`}
                    onClick={() => handleNavigation(item?.path)}
                  >
                    <img src={item?.imageSrc} alt={item?.label} className="h-6 w-auto" />
                    <p className="text-sm">{item?.label}</p>
                  </div>
                ))}
              </nav>
            </div>

            {/* Mobile Profile Section */}
            <div className="p-4 border-t border-green-100">
              <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
                <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium text-sm">M</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{subscriptionData?.subscription?.PricingPlan?.name || 'Free Plan'}</div>
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active {subscriptionData?.totalCredits || 0} Credits
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-[var(--primary-color)] border-b border-gray-200 px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-8 min-w-0">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              <div className='flex gap-2 md:gap-3 items-center min-w-0'>
                {/* Desktop collapsed sidebar toggle */}
                {sidebarCollapsed && (
                  <svg 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden lg:block cursor-pointer"
                  >
                    <path d="M17 7L12 12M12 12H15.75M12 12V8.25" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 18C2 16.114 2 15.172 2.586 14.586C3.172 14 4.114 14 6 14C7.886 14 8.828 14 9.414 14.586C10 15.172 10 16.114 10 18C10 19.886 10 20.828 9.414 21.414C8.828 22 7.886 22 6 22C4.114 22 3.172 22 2.586 21.414C2 20.828 2 19.886 2 18Z" stroke="#3D3D3D" strokeWidth="1.5" />
                    <path d="M12 2C16.714 2 19.071 2 20.535 3.464C22 4.93 22 7.286 22 12C22 16.714 22 19.071 20.535 20.535C19.178 21.894 17.055 21.993 13 22M2 11C2.008 6.945 2.107 4.822 3.464 3.464C4.438 2.491 5.807 2.164 8 2.055" stroke="#3D3D3D" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}

                <div className="w-24 md:w-38 h-auto flex-shrink-0">
                  <img src="/assets/landing/logo.png" alt="Brand" className="w-full h-auto" />
                </div>
              </div>
              
            </div>

            <div className="flex items-center gap-2 md:gap-4">
            
              
              {/* Mobile Help Button */}
              <button className="md:hidden bg-white p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <HelpCircle size={16} />
              </button>
              
              <ProfileMenu />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;