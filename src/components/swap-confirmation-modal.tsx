'use client';

import { useState, useEffect } from 'react';

interface SwapConfirmationModalProps {
  amount: number;
  rate: number;
  bonus: number;
  totalGASH: number;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SwapConfirmationModal({
  amount,
  rate,
  bonus,
  totalGASH,
  isOpen,
  onConfirm,
  onCancel,
}: SwapConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Call the onConfirm handler
      await onConfirm();
      setIsSuccess(true);

      // Auto-close after success animation
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error('Swap confirmation error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-light-50/90 backdrop-blur-lg border border-light-200 rounded-2xl p-6 shadow-xl shadow-gold-500/10 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gradient-gold mb-2">
            Confirm Swap
          </h2>
          <p className="text-light-600 mb-6">
            Please review the details before confirming
          </p>

          {/* GASH Preview Amount */}
          <div className="bg-gradient-to-r from-gold-100 to-gold-200 rounded-xl p-4 mb-6">
            <div className="text-3xl font-bold text-gold-700">
              {totalGASH.toFixed(2)} GASH
            </div>
            <div className="text-sm text-gold-600 mt-1">You will receive</div>
          </div>

          {/* Conversion Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-light-200">
              <span className="text-light-600">Swap Amount</span>
              <span className="font-medium">{amount.toFixed(2)} WLD</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-light-200">
              <span className="text-light-600">Conversion Rate</span>
              <span className="font-medium">
                1 WLD = {rate.toFixed(2)} GASH
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-light-200">
              <span className="text-light-600">Base GASH</span>
              <span className="font-medium">
                {(amount * rate).toFixed(2)} GASH
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-light-200">
              <span className="text-light-600">Bonus</span>
              <span className="font-medium text-success">
                +{bonus.toFixed(2)} GASH
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 font-bold">
              <span className="text-light-900">Total GASH</span>
              <span className="text-gold-700">{totalGASH.toFixed(2)} GASH</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading || isSuccess}
              className="btn-secondary flex-1 py-3"
            >
              {isSuccess ? 'Confirmed' : 'Cancel'}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || isSuccess}
              className={`btn-gold flex-1 py-3 ${
                isLoading || isSuccess ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner w-5 h-5 mr-2"></div>
                  Processing...
                </div>
              ) : isSuccess ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Success!
                </div>
              ) : (
                'Confirm Swap'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
