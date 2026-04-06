// src/services/social-media.service.ts
import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import crypto from 'crypto';

// ---------- Shared Types ----------
export interface TokenBundle {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number | null;
}

export interface BaseConfig {
  redirectUri: string;
}

export interface FacebookConfig extends BaseConfig {
  appId: string;
  appSecret: string;
  apiVersion?: string;
}

export interface InstagramConfig extends FacebookConfig { }

export interface TwitterConfig extends BaseConfig {
  clientId: string;
  clientSecret: string;
}

export interface LinkedInConfig extends BaseConfig {
  clientId: string;
  clientSecret: string;
}

export interface FacebookPostData {
  message?: string;
  link?: string;
  imageUrl?: string;
  videoUrl?: string;
  scheduledTime?: string | number | Date;
}

export interface InstagramPostData {
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
}

export interface TwitterPostData {
  text: string;
  mediaIds?: string[];
  replyToId?: string;
}

export interface LinkedInPostData {
  text: string;
  imageUrl?: string;
  articleUrl?: string;
  organizationId?: string;
}

// ---------- Base Class ----------
export abstract class BaseSocialMediaService<TConfig extends BaseConfig> {
  protected config: TConfig;
  protected accessToken: string | null = null;
  protected refreshToken: string | null = null;
  protected expiresAt: number | null = null;
  protected http: AxiosInstance;

  constructor(config: TConfig) {
    this.config = config;
    this.http = axios.create();
  }

  protected generateState(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  protected isTokenExpired(): boolean {
    return !!this.expiresAt && Date.now() >= this.expiresAt;
  }

  protected setTokens(accessToken: string, refreshToken: string | null = null, expiresIn: number | null = null): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (expiresIn) {
      this.expiresAt = Date.now() + expiresIn * 1000;
    }
  }
}

// ---------- Facebook ----------
export interface FacebookPage {
  id: string;
  name: string;
  category?: string;
  accessToken: string;
  canPost: boolean;
  instagramAccount?: { id: string } | undefined;
}

export interface FacebookPost {
  id: string;
  message?: string;
  createdTime: string;
  url: string;
  reactions: number;
  comments: number;
  shares: number;
}

export type FacebookPostMetrics = Record<'post_impressions' | 'post_reach' | 'post_engaged_users' | 'post_clicks', number>;

export class FacebookService extends BaseSocialMediaService<FacebookConfig> {
  private apiVersion: string;
  private baseUrl: string;

  constructor(config: FacebookConfig) {
    super(config);
    this.apiVersion = "v23.0";
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  getAuthUrl(
    scope = ''
  ): { authUrl: string; state: string } {
    const state = this.generateState();
    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope,
      response_type: 'code',
      state
    });
    return {
      authUrl: `https://www.facebook.com/${this.apiVersion}/dialog/oauth?${params}`,
      state
    };
  }

  async exchangeCodeForToken(code: string): Promise<TokenBundle> {
    try {
      const { data } = await this.http.get<{ access_token: string; expires_in: number }>(
        `${this.baseUrl}/oauth/access_token`,
        {
          params: {
            client_id: this.config.appId,
            client_secret: this.config.appSecret,
            redirect_uri: this.config.redirectUri,
            code
          }
        }
      );
      const { access_token, expires_in } = data;
      this.setTokens(access_token, null, expires_in);
      return { accessToken: access_token, expiresIn: expires_in };
    } catch (error: any) {
      throw new Error(`Facebook token exchange failed: ${error.response?.data?.error?.message ?? error.message}`);
    }
  }
  async exchangeShortForLongLived(shortToken: string): Promise<any> {
    try {
      const { data } = await this.http.get<{ access_token: string; expires_in: number }>(
        `${this.baseUrl}/oauth/access_token`,
        {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: this.config.appId,
            client_secret: this.config.appSecret,
            fb_exchange_token: shortToken,
          },
        }
      );

      const { access_token, expires_in } = data;
      const expiresAt = Date.now() + expires_in * 1000;
      this.setTokens(access_token, null, expires_in);

      return { accessToken: access_token, expiresIn: expires_in, expiresAt };
    } catch (error: any) {
      throw new Error(
        `Facebook long-lived token exchange failed: ${error.response?.data?.error?.message ?? error.message}`
      );
    }
  }
  async getUserInfo(): Promise<{ id: string; name: string; email?: string }> {
    try {
      const { data } = await this.http.get(`${this.baseUrl}/me`, {
        params: { access_token: this.accessToken, fields: 'id,name,email' }
      });
      return data;
    } catch (error: any) {
      throw new Error(`Failed to get user info: ${error.response?.data?.error?.message ?? error.message}`);
    }
  }

  async getPages(): Promise<FacebookPage[]> {
    try {
      const { data } = await this.http.get<{ data: any[] }>(`${this.baseUrl}/me/accounts`, {
        params: {
          access_token: this.accessToken,
          // fields: 'id,name,access_token,category,tasks,instagram_business_account'
        }
      });

      return data.data.map((page) => ({
        id: page.id,
        name: page.name,
        category: page.category,
        accessToken: page.access_token,
        canPost: Array.isArray(page.tasks) && page.tasks.includes('MANAGE'),
        instagramAccount: page.instagram_business_account
      }));
    } catch (error: any) {
      throw new Error(`Failed to get pages: ${error.response?.data?.error?.message ?? error.message}`);
    }
  }

  async createPost(pageId: string, pageAccessToken: string, postData: FacebookPostData): Promise<{ postId: string; scheduled: boolean }> {
    try {
      const { message, link, imageUrl, videoUrl, scheduledTime } = postData;
      const data: Record<string, any> = { access_token: pageAccessToken };

      let endpoint = `${this.baseUrl}/${pageId}/feed`;
      if (imageUrl) {
        endpoint = `${this.baseUrl}/${pageId}/photos`;
        data.url = imageUrl;
        data.caption = message;
      } else if (videoUrl) {
        endpoint = `${this.baseUrl}/${pageId}/videos`;
        data.file_url = videoUrl;
        data.description = message;
      } else {
        data.message = message;
        if (link) data.link = link;
      }

      if (scheduledTime) {
        data.scheduled_publish_time = Math.floor(new Date(scheduledTime).getTime() / 1000);
        data.published = false;
      }

      const { data: resp } = await this.http.post<{ id: string }>(endpoint, data);
      return { postId: resp.id, scheduled: !!scheduledTime };
    } catch (error: any) {
      throw new Error(`Failed to create Facebook post: ${error.response?.data?.error?.message ?? error.message}`);
    }
  }

  async getPosts(pageId: string, pageAccessToken: string, limit = 10): Promise<FacebookPost[]> {
    try {
      const { data } = await this.http.get<{ data: any[] }>(`${this.baseUrl}/${pageId}/posts`, {
        params: {
          access_token: pageAccessToken,
          fields: 'id,message,created_time,permalink_url,reactions.summary(true),comments.summary(true),shares',
          limit
        }
      });

      return data.data.map((post) => ({
        id: post.id,
        message: post.message,
        createdTime: post.created_time,
        url: post.permalink_url,
        reactions: post.reactions?.summary?.total_count ?? 0,
        comments: post.comments?.summary?.total_count ?? 0,
        shares: post.shares?.count ?? 0
      }));
    } catch (error: any) {
      throw new Error(`Failed to get Facebook posts: ${error.response?.data?.error?.message ?? error.message}`);
    }
  }

  async getPostAnalytics(postId: string, pageAccessToken: string): Promise<FacebookPostMetrics> {
    try {
      const { data } = await this.http.get<{ data: Array<{ name: keyof FacebookPostMetrics; values: Array<{ value: number }> }> }>(
        `${this.baseUrl}/${postId}/insights`,
        {
          params: {
            access_token: pageAccessToken,
            metric: 'post_impressions,post_reach,post_engaged_users,post_clicks'
          }
        }
      );

      const metrics: FacebookPostMetrics = {
        post_impressions: 0,
        post_reach: 0,
        post_engaged_users: 0,
        post_clicks: 0
      };
      data.data.forEach((m) => {
        metrics[m.name] = m.values?.[0]?.value ?? 0;
      });
      return metrics;
    } catch (error: any) {
      throw new Error(`Failed to get Facebook post analytics: ${error.response?.data?.error?.message ?? error.message}`);
    }
  }
}

// ---------- Instagram ----------
export class InstagramService extends BaseSocialMediaService<InstagramConfig> {
  private baseUrl = 'https://graph.instagram.com';

  getAuthUrl(): { authUrl: string; state: string } {
    const state = this.generateState();
    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: this.config.redirectUri,
      scope: 'instagram_business_basic,instagram_business_content_publish',

      // scope: 'instagram_business_basic', // ✅ Instagram scopes, not FB
      response_type: 'code',
      state
    });
    return {
      authUrl: `https://api.instagram.com/oauth/authorize?${params}`, // ✅ Correct IG endpoint
      state
    };
  }

  async exchangeCodeForToken(code: string): Promise<TokenBundle> {
    try {
      const { data } = await this.http.post<{
        access_token: string;
        user_id: string;
        expires_in: number;
      }>(
        'https://api.instagram.com/oauth/access_token',
        qs.stringify({
          client_id: this.config.appId,
          client_secret: this.config.appSecret,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirectUri,
          code
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      const { data: longToken } = await this.http.get<{
        access_token: string;
        expires_in: number;
      }>('https://graph.instagram.com/access_token', {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: this.config.appSecret,
          access_token: data.access_token
        }
      });

      const { access_token, expires_in } = longToken;
      this.setTokens(access_token, null, expires_in);
      return { accessToken: access_token, expiresIn: expires_in };
    } catch (error: any) {
      throw new Error(`Instagram token exchange failed: ${error.response?.data?.error_message ?? error.message}`);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenBundle> {
    try {
      const { data } = await this.http.get<{ access_token: string; expires_in: number }>(
        'https://graph.instagram.com/refresh_access_token',
        { params: { grant_type: 'ig_refresh_token', access_token: refreshToken } }
      );

      const { access_token, expires_in } = data;
      this.setTokens(access_token, null, expires_in);
      return { accessToken: access_token, expiresIn: expires_in };
    } catch (error: any) {
      console.log("error", error)
      throw new Error(`Instagram token refresh failed: ${error.response?.data?.error_message ?? error.message}`);
    }
  }

  async getUserInfo(): Promise<{ id: string; username: string }> {
    try {
      const { data } = await this.http.get(`${this.baseUrl}/me`, {
        params: { access_token: this.accessToken, fields: 'id,username' }
      });
      return data;
    } catch (error: any) {
      throw new Error(`Failed to get Instagram user info: ${error.response?.data?.error_message ?? error.message}`);
    }
  }

  async createPost(instagramAccountId: string, accessToken: string, postData: InstagramPostData): Promise<{ postId: string; containerId: string }> {
    try {
      const { imageUrl, caption, videoUrl } = postData;
      const containerData: Record<string, any> = {
        access_token: accessToken,
        caption
      };

      if (videoUrl) {
        containerData.media_type = 'VIDEO';
        containerData.video_url = videoUrl;
      } else {
        containerData.image_url = imageUrl;
      }

      const containerResponse = await this.http.post<{ id: string }>(`${this.baseUrl}/${instagramAccountId}/media`, containerData);
      const containerId = containerResponse.data.id;

      const publishResponse = await this.http.post<{ id: string }>(`${this.baseUrl}/${instagramAccountId}/media_publish`, {
        access_token: accessToken,
        creation_id: containerId
      });

      return { postId: publishResponse.data.id, containerId };
    } catch (error: any) {
      throw new Error(`Failed to create Instagram post: ${error.response?.data?.error?.message ?? error.message}`);
    }
  }

  async getPosts(instagramAccountId: string, accessToken: string, limit = 10): Promise<any[]> {
    try {
      const { data } = await this.http.get<{ data: any[] }>(`${this.baseUrl}/${instagramAccountId}/media`, {
        params: {
          access_token: accessToken,
          fields: 'id,caption,media_type,media_url,permalink,timestamp',
          limit
        }
      });
      return data.data;
    } catch (error: any) {
      throw new Error(`Failed to get Instagram posts: ${error.response?.data?.error?.message ?? error.message}`);
    }
  }

  async getPostAnalytics(postId: string, accessToken: string): Promise<Record<string, number>> {
    try {
      const { data } = await this.http.get<{ data: Array<{ name: string; values: Array<{ value: number }> }> }>(
        `${this.baseUrl}/${postId}/insights`,
        {
          params: {
            access_token: accessToken,
            metric: 'impressions,reach,engagement,saved,video_views'
          }
        }
      );

      const metrics: Record<string, number> = {};
      data.data.forEach((m) => {
        metrics[m.name] = m.values?.[0]?.value ?? 0;
      });
      return metrics;
    } catch (error: any) {
      throw new Error(`Failed to get Instagram post analytics: ${error.response?.data?.error?.message ?? error.message}`);
    }
  }
}

// ---------- Twitter ----------
export class TwitterService extends BaseSocialMediaService<TwitterConfig> {
  private baseUrl = 'https://api.twitter.com/2';
  private uploadUrl = 'https://upload.twitter.com/1.1';

  private generateCodeChallenge(): { codeVerifier: string; codeChallenge: string } {
    // Use a simple static challenge for plain method
    const codeVerifier = 'challenge'; // Simple static verifier
    const codeChallenge = 'challenge'; // Same as code_verifier for 'plain' method
    return { codeVerifier, codeChallenge };
  }

  getAuthUrl(scopes = 'tweet.write tweet.read users.read follows.read mute.read like.read block.read offline.access'): { authUrl: string; state: string; codeVerifier: string } {
    const state = this.generateState();
    const { codeChallenge, codeVerifier } = this.generateCodeChallenge();
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: scopes,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'plain'
    });
    return {
      authUrl: `https://twitter.com/i/oauth2/authorize?${params}`,
      state,
      codeVerifier,
    };
  }

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenBundle> {
    try {
      const { data } = await this.http.post<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
      }>(
        'https://api.twitter.com/2/oauth2/token',
        qs.stringify({
          code,
          grant_type: 'authorization_code',
          client_id: this.config.clientId,
          redirect_uri: this.config.redirectUri,
          code_verifier: codeVerifier
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          auth: {
            username: this.config.clientId,
            password: this.config.clientSecret
          }
        }
      );

      const { access_token, refresh_token, expires_in } = data;
      this.setTokens(access_token, refresh_token, expires_in);
      return { accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in };
    } catch (error: any) {
      throw new Error(`Twitter token exchange failed: ${error.response?.data?.error_description ?? error.message}`);
    }
  }

  async refreshAccessToken(): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { data } = await this.http.post<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
      }>(
        'https://api.twitter.com/2/oauth2/token',
        qs.stringify({
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
          client_id: this.config.clientId
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          auth: {
            username: this.config.clientId,
            password: this.config.clientSecret
          }
        }
      );

      const { access_token, refresh_token, expires_in } = data;
      this.setTokens(access_token, refresh_token, expires_in);
      return { accessToken: access_token, refreshToken: refresh_token };
    } catch (error: any) {
      throw new Error(`Twitter token refresh failed: ${error.response?.data?.error_description ?? error.message}`);
    }
  }

  async getUserInfo(): Promise<{ id: string; name: string; username: string; public_metrics?: any }> {
    try {
      const { data } = await this.http.get<{ data: any }>(`${this.baseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        params: { 'user.fields': 'id,name,username,public_metrics' }
      });
      return data.data;
    } catch (error: any) {
      console.log("error", error)
      throw new Error(`Failed to get Twitter user info: ${error.response?.data?.detail ?? error.message}`);
    }
  }

  async createPost(postData: TwitterPostData): Promise<{ postId: string; text: string }> {
    try {
      const { text, mediaIds, replyToId } = postData;
      const tweetData: any = { text };

      if (mediaIds?.length) {
        tweetData.media = { media_ids: mediaIds };
      }
      if (replyToId) {
        tweetData.reply = { in_reply_to_tweet_id: replyToId };
      }

      const { data } = await this.http.post<{ data: { id: string; text: string } }>(`${this.baseUrl}/tweets`, tweetData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return { postId: data.data.id, text: data.data.text };
    } catch (error: any) {
      throw new Error(`Failed to create Twitter post: ${error.response?.data?.detail ?? error.message}`);
    }
  }

  async uploadMedia(mediaUrl: string, mediaType: 'image' | 'video' = 'image'): Promise<string> {
    try {
      // download media
      const mediaResponse = await this.http.get<ArrayBuffer>(mediaUrl, { responseType: 'arraybuffer' });
      const mediaBuffer = Buffer.from(mediaResponse.data as any);

      const { data } = await this.http.post<{ media_id_string: string }>(
        `${this.uploadUrl}/media/upload.json`,
        qs.stringify({
          media_data: mediaBuffer.toString('base64'),
          media_category: mediaType === 'video' ? 'tweet_video' : 'tweet_image'
        }),
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return data.media_id_string;
    } catch (error: any) {
      throw new Error(`Failed to upload Twitter media: ${error.response?.data?.errors?.[0]?.message ?? error.message}`);
    }
  }

  async getPosts(userId: string, maxResults = 10): Promise<any[]> {
    try {
      const { data } = await this.http.get<{ data?: any[] }>(`${this.baseUrl}/users/${userId}/tweets`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        params: { 'tweet.fields': 'created_at,public_metrics,attachments', max_results: maxResults }
      });
      return data.data ?? [];
    } catch (error: any) {
      throw new Error(`Failed to get Twitter posts: ${error.response?.data?.detail ?? error.message}`);
    }
  }

  async getPostAnalytics(tweetId: string): Promise<{ retweet_count: number; reply_count: number; like_count: number; quote_count: number }> {
    try {
      const { data } = await this.http.get<{ data: { public_metrics: any } }>(`${this.baseUrl}/tweets/${tweetId}`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        params: { 'tweet.fields': 'public_metrics' }
      });
      return data.data.public_metrics;
    } catch (error: any) {
      throw new Error(`Failed to get Twitter post analytics: ${error.response?.data?.detail ?? error.message}`);
    }
  }
}

// ---------- LinkedIn ----------
export interface LinkedInUserInfo {
  id: string;
  firstName: Record<string, string>;
  lastName: Record<string, string>;
  email?: string;
  profilePicture?: string;
}

export class LinkedInService extends BaseSocialMediaService<LinkedInConfig> {
  private baseUrl = 'https://api.linkedin.com/v2';

  getAuthUrl(scopes = 'r_liteprofile,r_emailaddress,w_member_social,r_organization_social'): { authUrl: string; state: string } {
    const state = this.generateState();
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: scopes,
      state
    });
    return {
      authUrl: `https://www.linkedin.com/oauth/v2/authorization?${params}`,
      state
    };
  }

  async exchangeCodeForToken(code: string): Promise<TokenBundle> {
    try {
      const { data } = await this.http.post<{ access_token: string; expires_in: number }>(
        'https://www.linkedin.com/oauth/v2/accessToken',
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.config.redirectUri,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { access_token, expires_in } = data;
      this.setTokens(access_token, null, expires_in);
      return { accessToken: access_token, expiresIn: expires_in };
    } catch (error: any) {
      throw new Error(`LinkedIn token exchange failed: ${error.response?.data?.error_description ?? error.message}`);
    }
  }

  async getUserInfo(): Promise<LinkedInUserInfo> {
    try {
      const [profileResponse, emailResponse] = await Promise.all([
        this.http.get<any>(`${this.baseUrl}/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        }),
        this.http.get<any>(`${this.baseUrl}/emailAddress?q=members&projection=(elements*(handle~))`, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        })
      ]);

      const profile = profileResponse.data;
      const email = emailResponse.data.elements?.[0]?.['handle~']?.emailAddress;

      return {
        id: profile.id,
        firstName: profile.firstName.localized,
        lastName: profile.lastName.localized,
        email,
        profilePicture: profile.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier
      };
    } catch (error: any) {
      throw new Error(`Failed to get LinkedIn user info: ${error.response?.data?.message ?? error.message}`);
    }
  }

  async getOrganizations(): Promise<Array<{ id: string; role: string }>> {
    try {
      const { data } = await this.http.get<{ elements: any[] }>(`${this.baseUrl}/organizationalEntityAcls?q=roleAssignee`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      return data.elements.map((org) => ({
        id: org.organizationalTarget,
        role: org.role
      }));
    } catch (error: any) {
      throw new Error(`Failed to get LinkedIn organizations: ${error.response?.data?.message ?? error.message}`);
    }
  }

  async createPost(postData: LinkedInPostData): Promise<{ postId: string }> {
    try {
      const { text, imageUrl, articleUrl, organizationId } = postData;
      const author = organizationId
        ? `urn:li:organization:${organizationId}`
        : `urn:li:person:${await this.getUserId()}`;

      const shareData: any = {
        author,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      if (imageUrl) {
        const mediaUrn = await this.uploadMedia(imageUrl);
        shareData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
        shareData.specificContent['com.linkedin.ugc.ShareContent'].media = [{ status: 'READY', media: mediaUrn }];
      } else if (articleUrl) {
        shareData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE';
        shareData.specificContent['com.linkedin.ugc.ShareContent'].media = [{ status: 'READY', originalUrl: articleUrl }];
      }

      const response = await this.http.post(`${this.baseUrl}/ugcPosts`, shareData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      return { postId: response.headers['x-linkedin-id'] as string };
    } catch (error: any) {
      throw new Error(`Failed to create LinkedIn post: ${error.response?.data?.message ?? error.message}`);
    }
  }

  private async uploadMedia(mediaUrl: string): Promise<string> {
    try {
      const userInfo = await this.getUserInfo();

      const registerResponse = await this.http.post<any>(
        `${this.baseUrl}/assets?action=registerUpload`,
        {
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: `urn:li:person:${userInfo.id}`,
            serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const uploadUrl =
        registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerResponse.data.value.asset;

      const mediaResponse = await this.http.get<ArrayBuffer>(mediaUrl, { responseType: 'arraybuffer' });

      await this.http.post(uploadUrl, mediaResponse.data, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream'
        }
      });

      return asset;
    } catch (error: any) {
      throw new Error(`Failed to upload LinkedIn media: ${error.response?.data?.message ?? error.message}`);
    }
  }

  async getPosts(organizationId: string | null = null, count = 10): Promise<any[]> {
    try {
      const author = organizationId ? `urn:li:organization:${organizationId}` : `urn:li:person:${await this.getUserId()}`;
      const { data } = await this.http.get<{ elements: any[] }>(`${this.baseUrl}/shares`, {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        params: { q: 'owners', owners: author, count }
      });

      return data.elements;
    } catch (error: any) {
      throw new Error(`Failed to get LinkedIn posts: ${error.response?.data?.message ?? error.message}`);
    }
  }

  async getPostAnalytics(postUrn: string): Promise<{ likes: number; comments: number; shares: number }> {
    try {
      const { data } = await this.http.get<any>(`${this.baseUrl}/socialActions/${encodeURIComponent(postUrn)}`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      return {
        likes: data.totalLikes ?? 0,
        comments: data.totalFirstLevelComments ?? 0,
        shares: data.totalShares ?? 0
      };
    } catch (error: any) {
      throw new Error(`Failed to get LinkedIn post analytics: ${error.response?.data?.message ?? error.message}`);
    }
  }

  private async getUserId(): Promise<string> {
    const user = await this.getUserInfo();
    return user.id;
  }
}
