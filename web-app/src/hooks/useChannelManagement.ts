import { useState, useEffect } from 'react';
import { useHttp } from './useHttp';

interface Channel {
    channel_id: number;
    provider: 'INSTAGRAM' | 'TWITTER' | 'LINKEDIN' | 'FACEBOOK';
    handle: string;
    access_token?: string;
    refresh_token?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    meta_data?: any;
}

interface UseChannelManagement {
    channels: Channel[];
    loading: boolean;
    connecting: string | null;
    fetchChannels: () => Promise<void>;
    connectChannel: (provider: string) => Promise<void>;
    disconnectChannel: (channelId: number) => Promise<void>;
    getConnectedChannels: () => Channel[];
    refreshChannel: (channelId: number) => Promise<void>;
}

export const useChannelManagement = (): UseChannelManagement => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);
    const [connecting, setConnecting] = useState<string | null>(null);
    const httpService = new useHttp(true);

    const fetchChannels = async () => {
        setLoading(true);
        try {
            const response: any = await httpService.get('/channel/user/channels');
            if (response.data?.success) {
                setChannels(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
            // You can add toast notification here
        } finally {
            setLoading(false);
        }
    };

    const connectChannel = async (provider: string) => {
        setConnecting(provider);
        try {
            // Get OAuth URL from backend
            const response: any = await httpService.get(`/oauth/${provider.toLowerCase()}/auth-url`);
            if (response.data?.authUrl) {
                // Open popup for OAuth
                const popup = window.open(
                    response.data.authUrl,
                    'oauth',
                    'width=600,height=600,scrollbars=yes,resizable=yes'
                );
                if (popup && popup.document) {
                    try {
                        popup.document.cookie = document.cookie; // ✅ Copy cookies manually if allowed
                    } catch (e) {
                        console.log("Cross-origin popup, cookies can't be manually set.");
                    }
                }
                // Listen for OAuth completion
                const checkClosed = setInterval(() => {
                    if (popup?.closed) {
                        clearInterval(checkClosed);
                        setConnecting(null);
                        fetchChannels(); // Refresh channels after connection
                    }
                }, 1000);

                // Handle popup blocked
                if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                    setConnecting(null);
                    alert('Popup blocked! Please allow popups for this site to connect your social media accounts.');
                }
            }
        } catch (error) {
            console.error('Error initiating OAuth:', error);
            setConnecting(null);
            // You can add toast notification here
        }
    };

    const disconnectChannel = async (channelId: number) => {
        try {
            await httpService.delete(`/channel/${channelId}`);
            fetchChannels(); // Refresh channels after disconnection
            // You can add success toast notification here
        } catch (error) {
            console.error('Error disconnecting channel:', error);
            // You can add error toast notification here
        }
    };

    const refreshChannel = async (channelId: number) => {
        try {
            // This would refresh the access token if needed
            await httpService.post(`/channel/${channelId}/refresh`, {});
            fetchChannels(); // Refresh channels after token refresh
        } catch (error) {
            console.error('Error refreshing channel:', error);
        }
    };

    const getConnectedChannels = () => {
        return channels.filter(channel => channel.is_active);
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    return {
        channels,
        loading,
        connecting,
        fetchChannels,
        connectChannel,
        disconnectChannel,
        getConnectedChannels,
        refreshChannel
    };
};

export default useChannelManagement;
