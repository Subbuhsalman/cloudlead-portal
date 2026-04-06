// Global type definitions for the Cloud Lead application

declare global {
  interface Window {
    fs: any;
  }
}

// Channel types
export interface Channel {
  id: string;
  channel_id: string;
  handle: string;
  provider: 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'LINKEDIN' | 'all';
  is_active: boolean;
  active: boolean;
  created_at: string;
}

// Post types
export interface Post {
  id: string;
  content: string;
  status: 'SCHEDULED' | 'DRAFT' | 'PUBLISHED';
  provider: string;
  channelId: string;
  scheduledDateTime?: string;
  mediaUrl?: string;
  created_at: string;
  updated_at: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
}

// Redux action types
export interface ReduxAction {
  type: string;
  payload?: any;
  payLoad?: any; // Some actions use this variant
}

// Hook return types
export interface UseChannels {
  channels: Channel[];
  loading: boolean;
  error: string | null;
}

export interface UseChannelManagement {
  channels: Channel[];
  loading: boolean;
  connecting: string | null;
  connectChannel: (provider: string) => void;
  disconnectChannel: (channelId: string) => void;
  getConnectedChannels: () => Channel[];
}

// Form types
export interface PostFormData {
  content: string;
  provider: string;
  channelId: string;
  scheduledDateTime?: string;
  scheduleOption: 'NOW' | 'SCHEDULE';
  mediaUrl?: string;
  timezone: string;
}

export interface AIFormData {
  topic: string;
  objective: string;
  program: string;
  industry: string;
  audience: string;
  tone: string;
}

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export {};
