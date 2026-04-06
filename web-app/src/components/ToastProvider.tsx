"use client"
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { toast, ToastContainer, Slide, ToastOptions } from 'react-toastify';
import { CheckCircle, XCircle, AlertTriangle, Info, X, Zap, Heart, Star, LucideIcon } from 'lucide-react';
import { useGlobalHook } from '@/hooks';

// Type definitions
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'premium' | 'celebration';

interface ToastConfig {
    icon: React.ReactElement<any, any>;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    titleColor: string;
    messageColor: string;
}

interface CustomToastProps {
    type: ToastType;
    title?: string;
    message: string;
    onClose: () => void;
}

interface MinimalToastProps {
    type: ToastType;
    message: string;
    onClose: () => void;
}

interface ActionToastProps {
    type: ToastType;
    title?: string;
    message: string;
    actionText?: string;
    onAction?: () => void;
    onClose: () => void;
}

interface ToastPromiseMessages {
    pending?: string;
    success?: string;
    error?: string;
}

interface ToastMethods {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    premium: (message: string, title?: string) => void;
    celebration: (message: string, title?: string) => void;
    minimal: (message: string, type?: ToastType) => void;
    action: (
        message: string,
        title?: string,
        actionText?: string,
        onAction?: () => void,
        type?: ToastType
    ) => void;
    promise: <T>(
        promise: Promise<T>,
        messages: ToastPromiseMessages
    ) => Promise<T>;
}

interface ToastProviderProps {
    children: ReactNode;
}

// Create Toast Context
const ToastContext = createContext<ToastMethods | undefined>(undefined);

// Custom Toast Components
const CustomToast: React.FC<CustomToastProps> = ({ type, title, message, onClose }) => {
    const getToastConfig = (): ToastConfig => {
        const configs: Record<ToastType, ToastConfig> = {
            success: {
                icon: <CheckCircle className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
                borderColor: 'border-green-200',
                iconColor: 'text-green-500',
                titleColor: 'text-green-800',
                messageColor: 'text-green-600'
            },
            error: {
                icon: <XCircle className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
                borderColor: 'border-red-200',
                iconColor: 'text-red-500',
                titleColor: 'text-red-800',
                messageColor: 'text-red-600'
            },
            warning: {
                icon: <AlertTriangle className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
                borderColor: 'border-yellow-200',
                iconColor: 'text-yellow-500',
                titleColor: 'text-yellow-800',
                messageColor: 'text-yellow-600'
            },
            info: {
                icon: <Info className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-r from-blue-50 to-sky-50',
                borderColor: 'border-blue-200',
                iconColor: 'text-blue-500',
                titleColor: 'text-blue-800',
                messageColor: 'text-blue-600'
            },
            premium: {
                icon: <Star className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-r from-green-50 via-pink-50 to-green-50',
                borderColor: 'border-green-200',
                iconColor: 'text-green-500',
                titleColor: 'text-green-800',
                messageColor: 'text-[var(--primary-color)]'
            },
            celebration: {
                icon: <Heart className="w-6 h-6" />,
                bgColor: 'bg-gradient-to-r from-pink-50 to-rose-50',
                borderColor: 'border-pink-200',
                iconColor: 'text-pink-500',
                titleColor: 'text-pink-800',
                messageColor: 'text-pink-600'
            }
        };

        return configs[type];
    };

    const config = getToastConfig();

    return (
        <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 shadow-lg max-w-sm w-full relative`}>
            <div className="flex items-start space-x-3">
                <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
                    {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className={`${config.titleColor} font-semibold text-sm mb-1`}>
                            {title}
                        </h4>
                    )}
                    <p className={`${config.messageColor} text-sm leading-relaxed`}>
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Minimal Toast Component
const MinimalToast: React.FC<MinimalToastProps> = ({ type, message, onClose }) => {
    const getConfig = (): { bgColor: string; textColor: string } => {
        const configs: Record<ToastType, { bgColor: string; textColor: string }> = {
            success: { bgColor: 'bg-green-500', textColor: 'text-white' },
            error: { bgColor: 'bg-red-500', textColor: 'text-white' },
            warning: { bgColor: 'bg-yellow-500', textColor: 'text-white' },
            info: { bgColor: 'bg-blue-500', textColor: 'text-white' },
            premium: { bgColor: 'bg-green-500', textColor: 'text-white' },
            celebration: { bgColor: 'bg-pink-500', textColor: 'text-white' }
        };

        return configs[type] || { bgColor: 'bg-gray-500', textColor: 'text-white' };
    };

    const config = getConfig();

    return (
        <div className={`${config.bgColor} ${config.textColor} rounded-lg px-4 py-3 shadow-lg flex items-center justify-between max-w-sm w-full`}>
            <span className="text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-3 opacity-80 hover:opacity-100"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// Action Toast Component
const ActionToast: React.FC<ActionToastProps> = ({ type, title, message, actionText, onAction, onClose }) => {
    const getConfig = (): {
        bgColor: string;
        borderColor: string;
        titleColor: string;
        messageColor: string;
        buttonColor: string;
    } => {
        const configs: Record<ToastType, {
            bgColor: string;
            borderColor: string;
            titleColor: string;
            messageColor: string;
            buttonColor: string;
        }> = {
            success: {
                bgColor: 'bg-white',
                borderColor: 'border-l-4 border-l-green-500',
                titleColor: 'text-gray-900',
                messageColor: 'text-gray-600',
                buttonColor: 'bg-green-500 hover:bg-green-600'
            },
            error: {
                bgColor: 'bg-white',
                borderColor: 'border-l-4 border-l-red-500',
                titleColor: 'text-gray-900',
                messageColor: 'text-gray-600',
                buttonColor: 'bg-red-500 hover:bg-red-600'
            },
            warning: {
                bgColor: 'bg-white',
                borderColor: 'border-l-4 border-l-yellow-500',
                titleColor: 'text-gray-900',
                messageColor: 'text-gray-600',
                buttonColor: 'bg-yellow-500 hover:bg-yellow-600'
            },
            info: {
                bgColor: 'bg-white',
                borderColor: 'border-l-4 border-l-blue-500',
                titleColor: 'text-gray-900',
                messageColor: 'text-gray-600',
                buttonColor: 'bg-blue-500 hover:bg-blue-600'
            },
            premium: {
                bgColor: 'bg-white',
                borderColor: 'border-l-4 border-l-green-500',
                titleColor: 'text-gray-900',
                messageColor: 'text-gray-600',
                buttonColor: 'bg-green-500 hover:bg-[var(--primary-color)]'
            },
            celebration: {
                bgColor: 'bg-white',
                borderColor: 'border-l-4 border-l-pink-500',
                titleColor: 'text-gray-900',
                messageColor: 'text-gray-600',
                buttonColor: 'bg-pink-500 hover:bg-pink-600'
            }
        };

        return configs[type];
    };

    const config = getConfig();

    return (
        <div className={`${config.bgColor} ${config.borderColor} rounded-lg p-4 shadow-lg max-w-sm w-full`}>
            <div className="flex justify-between items-start mb-3">
                {title && (
                    <h4 className={`${config.titleColor} font-semibold text-sm`}>
                        {title}
                    </h4>
                )}
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <p className={`${config.messageColor} text-sm mb-3`}>{message}</p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className={`${config.buttonColor} text-white px-3 py-2 rounded text-sm font-medium transition-colors`}
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

// Toast Provider Component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    // Toast functions with proper typing
    const {
        showToast,
        toastMessage,
        // closable,
        toastDetail,
        toastType,
        toastLife,
        sticky,
        toastId,
        updateGlobalToast
    } = useGlobalHook();


    useEffect(() => {
        if (showToast && toastMessage !== null) {
            toastMethods[toastType](toastMessage, toastDetail);
            // Reset the global toast state after showing
            updateGlobalToast({ showToast: false });
        }
        return () => { };
    }, [
        showToast,
        toastMessage,
        toastDetail,
        toastType,
        toastLife,
        sticky,
        toastId,
    ]);

    const toastMethods: ToastMethods | any = {
        success: (message: string, title?: string): void => {
            toast(
                ({ closeToast }) => (
                    <CustomToast
                        type="success"
                        title={title}
                        message={message}
                        onClose={closeToast!}
                    />
                ),
                {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeButton: false,
                } as ToastOptions
            );
        },

        error: (message: string, title?: string): void => {
            toast(
                ({ closeToast }) => (
                    <CustomToast
                        type="error"
                        title={title}
                        message={message}
                        onClose={closeToast!}
                    />
                ),
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeButton: false,
                } as ToastOptions
            );
        },

        warning: (message: string, title?: string): void => {
            toast(
                ({ closeToast }) => (
                    <CustomToast
                        type="warning"
                        title={title}
                        message={message}
                        onClose={closeToast!}
                    />
                ),
                {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeButton: false,
                } as ToastOptions
            );
        },

        info: (message: string, title?: string): void => {
            toast(
                ({ closeToast }) => (
                    <CustomToast
                        type="info"
                        title={title}
                        message={message}
                        onClose={closeToast!}
                    />
                ),
                {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeButton: false,
                } as ToastOptions
            );
        },

        premium: (message: string, title?: string): void => {
            toast(
                ({ closeToast }) => (
                    <CustomToast
                        type="premium"
                        title={title}
                        message={message}
                        onClose={closeToast!}
                    />
                ),
                {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: true,
                    closeButton: false,
                } as ToastOptions
            );
        },

        celebration: (message: string, title?: string): void => {
            toast(
                ({ closeToast }) => (
                    <CustomToast
                        type="celebration"
                        title={title}
                        message={message}
                        onClose={closeToast!}
                    />
                ),
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeButton: false,
                } as ToastOptions
            );
        },

        minimal: (message: string, type: ToastType = 'info'): void => {
            toast(
                ({ closeToast }) => (
                    <MinimalToast
                        type={type}
                        message={message}
                        onClose={closeToast!}
                    />
                ),
                {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeButton: false,
                } as ToastOptions
            );
        },

        action: (
            message: string,
            title?: string,
            actionText?: string,
            onAction?: () => void,
            type: ToastType = 'info'
        ): void => {
            toast(
                ({ closeToast }) => (
                    <ActionToast
                        type={type}
                        title={title}
                        message={message}
                        actionText={actionText}
                        onAction={() => {
                            onAction?.();
                            closeToast!();
                        }}
                        onClose={closeToast!}
                    />
                ),
                {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: true,
                    closeButton: false,
                } as ToastOptions
            );
        },

        promise: async <T,>(
            promise: Promise<T>,
            messages: ToastPromiseMessages
        ): Promise<T> => {
            return toast.promise<T>(
                promise,
                {
                    pending: {
                        render: ({ closeToast }) => (
                            <CustomToast
                                type="info"
                                title="Loading..."
                                message={messages.pending || "Processing your request..."}
                                onClose={closeToast!}
                            />
                        ),
                    },
                    success: {
                        render: ({ data, closeToast }) => (
                            <CustomToast
                                type="success"
                                title="Success!"
                                message={messages.success || "Operation completed successfully!"}
                                onClose={closeToast!}
                            />
                        ),
                    },
                    error: {
                        render: ({ data, closeToast }) => (
                            <CustomToast
                                type="error"
                                title="Error"
                                message={messages.error || "Something went wrong!"}
                                onClose={closeToast!}
                            />
                        ),
                    }
                },
                {
                    position: "top-right",
                    hideProgressBar: true,
                    closeButton: false,
                } as ToastOptions<T>
            );
        }
    };

    return (
        <ToastContext.Provider value={toastMethods}>
            {children}
            <ToastContainer
                position="top-right"
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
                style={{ zIndex: 9999 }}
                toastStyle={{
                    padding: 0,
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none'
                }}
            />
        </ToastContext.Provider>
    );
};

// Hook to use toast with proper error handling
export const useToast = (): ToastMethods => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

