'use client'
import React, { useEffect, useRef, useCallback } from 'react';
import { Toast } from 'primereact/toast';
import { useGlobalHook } from '@/hooks';

export default function ToastProvider({children}:any) {
    const toast = useRef<Toast>(null);
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

    const showContrast = useCallback(() => {
        if (toast.current) {
            toast.current.show({ 
                severity: toastType, 
                summary: toastMessage, 
                detail: toastDetail, 
                life: toastLife || 3000, 
                sticky: sticky || false 
            });
        }
    }, [toastType, toastMessage, toastDetail, toastLife, sticky]);
    
    useEffect(() => {
        if (showToast && toastMessage !== null && toastMessage !== '') {
            showContrast();
            // Auto-hide toast after showing
            const timer = setTimeout(() => {
                updateGlobalToast({showToast: false});
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [
        showToast,
        toastMessage,
        toastDetail,
        toastType,
        toastLife,
        sticky,
        toastId,
        showContrast,
        updateGlobalToast,
    ]);

    return (
        <>
        {children}
            <Toast ref={toast} />
        </>
    )
}
        