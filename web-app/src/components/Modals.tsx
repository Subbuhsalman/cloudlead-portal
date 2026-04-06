import React from 'react';
import { X, Settings, User, CreditCard, ChevronDown } from 'lucide-react';
import { useHttp, useLoginDetails } from '@/hooks';
import { useRouter } from 'next/navigation';
import { BrandOnboardingModal } from './BrandOnboardingModal';

const SettingsModals = () => {
  const router = useRouter()
  const { userDetail, removeUserInfo } = useLoginDetails()
  const name = userDetail?.userDetail?.name || "";
  const email = userDetail?.userDetail?.email || "";

  const downloadIvoice = () => {
    const db = new useHttp();
    db.get("/invoices/current").then((res: any) => {
      window.open(res?.data?.data?.invoice_pdf, '_blank');
    })
  }

  // Modal backdrop component
  const ModalBackdrop = ({ children, isOpen }: any) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  };

  // Settings Modal
  const SettingsModal = (props: any) => {
    const { visible, closeModal } = props;
    return (<ModalBackdrop isOpen={visible}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Settings className="text-[var(--primary-color)]" size={24} />
            <h2 className="text-xl font-semibold text-[var(--primary-color)]">Settings</h2>
          </div>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Account & Security</h3>

          {/* Language */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Language</span>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg min-w-[120px]">
              <span className="text-gray-600">Auto-detect</span>
              <ChevronDown size={16} className="text-gray-600" />
            </div>
          </div>

          {/* Change Password */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Change Password</span>
            <button className="bg-green-100 text-[var(--primary-color)] px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
              Update Password
            </button>
          </div>

          {/* Delete all chats */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Delete all chats</span>
            <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
              Delete All
            </button>
          </div>

          {/* Log out */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Log out of all devices</span>
            <button onClick={() => { removeUserInfo() }} className="border-2 border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
              Logout All
            </button>
          </div>
        </div>
      </div>
    </ModalBackdrop>
    )
  };

  // Profile Modal
  const ProfileModal = (props: any) => {
    const { visible, closeModal } = props;
    return (<ModalBackdrop isOpen={visible}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User className="text-[var(--primary-color)]" size={24} />
            <h2 className="text-xl font-semibold text-[var(--primary-color)]">My Profile</h2>
          </div>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Info</h3>

          {/* Name */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Name</span>
            <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              {name}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Email</span>
            <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              {email}
            </span>
          </div>

          {/* Time Zone */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Time Zone</span>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg min-w-[120px]">
              <span className="text-gray-600">Auto-detect</span>
              <ChevronDown size={16} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </ModalBackdrop>
    )
  };

  // Billing Modal
  const BillingModal = (props: any) => {
    const { visible, closeModal } = props;
    return (<ModalBackdrop isOpen={visible}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CreditCard className="text-[var(--primary-color)]" size={24} />
            <h2 className="text-xl font-semibold text-[var(--primary-color)]">Plan & Billing</h2>
          </div>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Info</h3>

          {/* Current Plan */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Current Plan</span>
            <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              Standard — 35,000 credits
            </span>
          </div>

          {/* Renewal Date */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Renewal Date</span>
            <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              August 15, 2025
            </span>
          </div>

          {/* Billing Email */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Billing Email</span>
            <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              {email}
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Payment Method</span>
            <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              **** **** **** 4923 (Visa)
            </span>
          </div>

          {/* Invoices */}
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Invoices</span>
            <button onClick={() => { downloadIvoice() }} className="bg-green-100 text-[var(--primary-color)] px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
              Download Invoices
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button onClick={() => {
            router.push("/dashboard/pricing")
          }} className="flex-1 bg-green-100 text-[var(--primary-color)] py-3 rounded-lg hover:bg-green-200 transition-colors font-medium">
            Upgrade Plan
          </button>
          <button className="flex-1 bg-[var(--primary-color)] text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
            Cancel Subscription
          </button>
        </div>
      </div>
    </ModalBackdrop>
    )
  };

  return { SettingsModal, ProfileModal, BillingModal, BrandOnboardingModal }
};

export { SettingsModals };