'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';

export default function SwapSuccessPage() {
  const router = useRouter();
  const transactions = useAppStore(state => state.transactions);
  const [copied, setCopied] = useState(false);

  // Get the most recent transaction (the one we just completed)
  const latestTransaction = transactions.length > 0 ? transactions[0] : null;

  // Auto-redirect to dashboard after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleCopyHash = () => {
    if (latestTransaction?.txHash) {
      navigator.clipboard.writeText(latestTransaction.txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewOnBlockchain = () => {
    // In a real app, this would link to a blockchain explorer
    // For now, we'll just open a new tab with a placeholder URL
    window.open(
      `https://worldcoin.blockscout.com/tx/${latestTransaction?.txHash}`,
      '_blank'
    );
  };

  const handleReturnToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 safe-top safe-bottom">
      <div className="w-full max-w-md">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-48 h-48 mb-6">
            {/* Vault opening animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 animate-pulse-gold shadow-glow"></div>
            </div>

            {/* Gold shine effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gold-200 to-gold-400 animate-ping opacity-75"></div>
            </div>

            {/* Checkmark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-light-50"
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
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gradient-gold mb-2">
            Swap Successful!
          </h1>
          <p className="text-light-600">Your transaction has been confirmed</p>
        </div>

        {/* Details Section */}
        {latestTransaction && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Transaction Details
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-light-200">
                <span className="text-light-600">WLD Spent</span>
                <span className="font-medium">
                  {latestTransaction.amountWLD.toFixed(2)} WLD
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-light-200">
                <span className="text-light-600">GASH Received</span>
                <span className="font-medium text-gold-700">
                  {latestTransaction.amountGASH.toFixed(2)} GASH
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-light-200">
                <span className="text-light-600">Bonus</span>
                <span className="font-medium text-success">
                  +{latestTransaction.bonusGASH.toFixed(2)} GASH
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 font-bold">
                <span className="text-light-900">Total GASH</span>
                <span className="text-gold-700">
                  {(
                    latestTransaction.amountGASH + latestTransaction.bonusGASH
                  ).toFixed(2)}{' '}
                  GASH
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Hash */}
        {latestTransaction && (
          <div className="card mb-6">
            <h3 className="text-sm font-medium text-light-600 mb-2">
              Transaction Hash
            </h3>
            <div className="flex items-center justify-between bg-light-100 rounded-lg p-3">
              <span className="text-xs font-mono text-light-700 truncate mr-2">
                {latestTransaction.txHash}
              </span>
              <button
                onClick={handleCopyHash}
                className="flex-shrink-0 text-gold-600 hover:text-gold-800"
                title="Copy transaction hash"
              >
                {copied ? (
                  <svg
                    className="w-5 h-5"
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
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={handleViewOnBlockchain}
              className="mt-3 text-sm text-gold-600 hover:text-gold-800 font-medium w-full text-center"
            >
              View on Blockchain
            </button>
          </div>
        )}

        {/* Return to Dashboard Button */}
        <button
          onClick={handleReturnToDashboard}
          className="btn-gold w-full py-3"
        >
          Return to Dashboard
        </button>

        {/* Auto redirect message */}
        <p className="text-center text-sm text-light-500 mt-4">
          Returning to dashboard in 5 seconds...
        </p>
      </div>
    </div>
  );
}
