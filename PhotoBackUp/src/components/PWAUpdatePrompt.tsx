import React, { useState, useEffect } from 'react';
import { Download, X, RefreshCw } from 'lucide-react';

interface PWAUpdatePromptProps {
  onUpdate?: () => void;
  onDismiss?: () => void;
}

export const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({
  onUpdate,
  onDismiss,
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleSWUpdate = (event: Event) => {
      const registration = (event as any).detail;
      if (registration && registration.waiting) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('swUpdate', handleSWUpdate);

    // Check if there's already a waiting service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          setShowPrompt(true);
        }
      });
    }

    return () => {
      window.removeEventListener('swUpdate', handleSWUpdate);
    };
  }, []);

  const handleUpdate = async () => {
    if (!('serviceWorker' in navigator)) return;

    setIsUpdating(true);

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Wait for the new service worker to take control
        const refreshing = new Promise<void>((resolve) => {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            resolve();
          });
        });

        await refreshing;
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating service worker:', error);
      setIsUpdating(false);
    }

    onUpdate?.();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismiss?.();
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm z-50">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Download className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-1">
            Güncelleme Mevcut
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Uygulamanın yeni bir sürümü mevcut. Şimdi güncellemek istiyor musunuz?
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Güncelleniyor...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Güncelle</span>
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for PWA installation
export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) return false;

    const result = await installPrompt.prompt();
    setInstallPrompt(null);
    setIsInstallable(false);

    return result.outcome === 'accepted';
  };

  return {
    isInstallable,
    promptInstall,
  };
};