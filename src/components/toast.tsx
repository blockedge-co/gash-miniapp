import { useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const toastVariants = cva(
  'fixed bottom-4 right-4 z-50 rounded-lg p-4 shadow-lg max-w-xs transition-all duration-300',
  {
    variants: {
      variant: {
        success: 'bg-blue-500 text-white',
        error: 'bg-amber-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
);

interface ToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
  variant?: 'success' | 'error';
}

export function Toast({
  message,
  variant,
  onDismiss,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div className={toastVariants({ variant })}>
      <div className="flex items-center justify-between">
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const showToast = (
    message: string,
    variant: 'success' | 'error',
    duration?: number
  ) => {
    // Implementation would use a toast provider/store
    console.log(`Toast: ${message} (${variant})`);
  };

  return { showToast };
}
