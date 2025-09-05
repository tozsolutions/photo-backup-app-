import React from 'react';
import { Smartphone, X } from 'lucide-react';
import { useInstallPrompt } from './PWAUpdatePrompt';

interface InstallPromptProps {
  onDismiss?: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const { isInstallable, promptInstall } = useInstallPrompt();

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      onDismiss?.();
    }
  };

  if (!isInstallable) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-md z-50">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Smartphone className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-1">
            Uygulamayı Yükle
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            PhotoBackup uygulamasını cihazınıza yükleyerek daha hızlı erişim sağlayın.
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstall}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Yükle
            </button>
            <button
              onClick={onDismiss}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm"
            >
              Şimdi Değil
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};