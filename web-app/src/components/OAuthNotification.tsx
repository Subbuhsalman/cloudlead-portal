import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface OAuthNotificationProps {
    onClose?: () => void;
}

const OAuthNotification: React.FC<OAuthNotificationProps> = ({ onClose }) => {
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | null;
        message: string;
        platform?: string;
    }>({ type: null, message: '' });
    
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const connected = searchParams?.get('connected');
        const error = searchParams?.get('error');

        if (connected) {
            setNotification({
                type: 'success',
                message: `Successfully connected your ${connected.charAt(0).toUpperCase() + connected.slice(1)} account!`,
                platform: connected
            });
            
            // Clean up URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                setNotification({ type: null, message: '' });
                onClose?.();
            }, 5000);
        }

        if (error) {
            let errorMessage = 'Failed to connect your social media account.';
            
            if (error.includes('instagram')) {
                errorMessage = 'Failed to connect Instagram. Please try again.';
            } else if (error.includes('twitter')) {
                errorMessage = 'Failed to connect Twitter/X. Please try again.';
            } else if (error.includes('linkedin')) {
                errorMessage = 'Failed to connect LinkedIn. Please try again.';
            }

            setNotification({
                type: 'error',
                message: errorMessage
            });
            
            // Clean up URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            
            // Auto hide after 8 seconds for errors
            setTimeout(() => {
                setNotification({ type: null, message: '' });
                onClose?.();
            }, 8000);
        }
    }, [searchParams, onClose]);

    if (!notification.type) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg p-4 ${
            notification.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
        }`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {notification.type === 'success' ? (
                        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${
                        notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                        {notification.type === 'success' ? 'Success!' : 'Error!'}
                    </p>
                    <p className={`mt-1 text-sm ${
                        notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}>
                        {notification.message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={() => {
                            setNotification({ type: null, message: '' });
                            onClose?.();
                        }}
                        className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            notification.type === 'success' 
                                ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                                : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                        }`}
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OAuthNotification;
