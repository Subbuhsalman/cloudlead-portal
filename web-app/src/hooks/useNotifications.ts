import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    const newNotification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration (default 5 seconds)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message: string, duration?: number) => {
    return addNotification({ type: 'success', message, duration });
  }, [addNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    return addNotification({ type: 'error', message, duration });
  }, [addNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    return addNotification({ type: 'info', message, duration });
  }, [addNotification]);

  const showWarning = useCallback((message: string, duration?: number) => {
    return addNotification({ type: 'warning', message, duration });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
