import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'banner';

interface NotificationToastProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isBanner = type === 'banner';
  const isSuccess = type === 'success';

  return (
    <div
      className={
        `fixed top-20 right-6 z-50 max-w-sm w-full rounded-xl shadow-2xl flex items-start p-4 animate-in slide-in-from-right-10 fade-in duration-300 ` +
        (isBanner
          ? 'bg-indigo-600 text-white border border-indigo-500'
          : 'bg-white border-l-4 ' + (isSuccess ? 'border-green-500' : 'border-red-500'))
      }
    >
      <div
        className={
          'p-1 rounded-full mr-3 shrink-0 ' +
          (isBanner
            ? 'bg-indigo-500 text-white'
            : isSuccess
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600')
        }
      >
        {isBanner
          ? <RefreshCw className="w-5 h-5" />
          : isSuccess
            ? <CheckCircle className="w-5 h-5" />
            : <AlertCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1 mr-2">
        <h4
          className={
            'text-sm font-bold ' +
            (isBanner
              ? 'text-white'
              : isSuccess
                ? 'text-green-800'
                : 'text-red-800')
          }
        >
          {isBanner ? 'Synchronizing' : isSuccess ? 'Success' : 'Error'}
        </h4>
        <p
          className={
            'text-sm mt-0.5 leading-snug ' +
            (isBanner ? 'text-indigo-50' : 'text-slate-600')
          }
        >
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className={
          'transition-colors ' +
          (isBanner ? 'text-indigo-100 hover:text-white' : 'text-slate-400 hover:text-slate-600')
        }
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
