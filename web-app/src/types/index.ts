// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Post related types
export interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  scheduledAt?: string;
  status: 'queue' | 'draft' | 'sent';
  channels: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CreatePostRequest {
  content: string;
  mediaUrl?: string;
  channels: string[];
  status: 'queue' | 'draft';
  scheduledAt?: string;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

// Channel related types
export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'x' | 'tiktok' | 'pinterest' | 'youtube';

export interface Channel {
  id: string;
  name: string;
  platform: SocialPlatform;
  isConnected: boolean;
  profileImage?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChannelRequest {
  name: string;
  platform: SocialPlatform;
  accessToken: string;
  refreshToken?: string;
  profileImage?: string;
}

// Media related types
export interface MediaUploadResponse {
  mediaUrl: string;
  thumbnailUrl?: string;
  type: 'image' | 'video';
  size: number;
  filename: string;
}

// Filter and pagination types
export interface PostFilters {
  status?: 'queue' | 'draft' | 'sent';
  channelId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// UI state types
export interface DashboardState {
  activeTab: 'queue' | 'draft' | 'sent';
  selectedChannel: string;
  viewMode: 'list' | 'calendar';
  filters: PostFilters;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Scheduling types
export interface ScheduleOptions {
  immediate?: boolean;
  scheduledAt?: string;
  timezone?: string;
  recurring?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
}

// Analytics types (for future use)
export interface PostAnalytics {
  postId: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
  engagement: number;
  reach: number;
  impressions: number;
}

// User preferences types
export interface UserPreferences {
  timezone: string;
  defaultScheduleTime: string;
  notifications: {
    email: boolean;
    browser: boolean;
    postPublished: boolean;
    postFailed: boolean;
    weeklyReport: boolean;
  };
}



export interface AIFormData {
  // Legacy fields
  topic?: string;
  objective?: string;
  program?: string;
  industry?: string;
  audience?: string;
  tone?: string;
  socialMedia?: 'Facebook' | 'Twitter' | 'Instagram' | 'LinkedIn';
  wordCount?: number;
  contentType?: 'short_video' | 'explainer' | 'webinar' | 'speaker_notes';
  lengthPreference?: '30s' | '1-2 min' | '5-10 min' | 'full talk';
  emailType?: string;
  targetAudience?: string;
  industryContext?: string;
  mainMessage?: string;
  cta?: string;
  subContentType?: string;

  // Pitch deck specific fields
  deckGoal?: string;
  duration?: string;
  competitors?: string;
  keyProofPoint?: string;
  callToAction?: string;
  prompt?: string;

  b2bContentType?: string;
  callLength?: string;
  additionalContext?: string; 
  discoveryTone?: string;
  persona?: string;
  callGoal?: string;
  knownChallenges?: string;
  expectedObjections?: string;
}