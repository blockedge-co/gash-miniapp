import { X, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

type ErrorType = 'auth' | 'rate_limit' | 'input' | 'generic';

interface ErrorHandlerProps {
  type: ErrorType;
  title: string;
  message: string;
  fullScreen?: boolean;
  autoDismiss?: boolean;
  dismissTimeout?: number;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorHandler({
  type,
  title,
  message,
  fullScreen = false,
  autoDismiss = false,
  dismissTimeout = 5000,
  onRetry,
  onDismiss,
}: ErrorHandlerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissTimeout);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTimeout, onDismiss]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'auth':
        return <ShieldAlert className="w-6 h-6" />;
      case 'rate_limit':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'auth':
        return 'bg-error/10 text-error border-error/20';
      case 'rate_limit':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-light-200 text-light-800 border-light-300';
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-light-900/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div
          className={`max-w-md w-full rounded-2xl border p-6 shadow-xl ${getColor()} animate-fade-in`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm">{message}</p>
              <div className="mt-4 flex gap-3">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    Retry
                  </button>
                )}
                {type === 'auth' && (
                  <button
                    onClick={onDismiss}
                    className="btn-secondary py-2 px-4 text-sm"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
            {!autoDismiss && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  onDismiss?.();
                }}
                className="text-light-500 hover:text-light-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-4 ${getColor()} animate-slide-up flex items-start gap-3`}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium mt-2 text-primary-600 hover:text-primary-800"
          >
            Try again
          </button>
        )}
      </div>
      {!autoDismiss && (
        <button
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          className="text-light-500 hover:text-light-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
