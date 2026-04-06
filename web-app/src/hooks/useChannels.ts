import { useState, useEffect } from 'react';
import { Channel, CreateChannelRequest, SocialPlatform } from '@/types';
import { useHttp } from './useHttp';

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = new useHttp()
  const fetchChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response:any = await db.get("/channel");
      setChannels(response.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch channels';
      setError(errorMessage);
      console.error('Error fetching channels:', err);
    } finally {
      setLoading(false);
    }
  };

  const createChannel = async (channelData: CreateChannelRequest): Promise<Channel> => {
    try {
      const response:any = await db.post("/channel",channelData);
      const newChannel = response.data.channel;
      setChannels(prev => [...prev, newChannel]);
      return newChannel;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create channel';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateChannel = async (channelId: string, channelData: Partial<CreateChannelRequest>): Promise<Channel> => {
    try {
      const response:any = await db.put(`/channel/${channelId}`, channelData);
      const updatedChannel = response.data.channel;
      setChannels(prev => prev.map(channel => 
        channel.id === channelId ? updatedChannel : channel
      ));
      return updatedChannel;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update channel';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteChannel = async (channelId: string): Promise<void> => {
    try {
      await db.delete(`/channel/${channelId}`);
      setChannels(prev => prev.filter(channel => channel.id !== channelId));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete channel';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return {
    channels,
    loading,
    error,
    refetch: fetchChannels,
    createChannel,
    updateChannel,
    deleteChannel,
  };
};
