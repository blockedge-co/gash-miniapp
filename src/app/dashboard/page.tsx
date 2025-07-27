'use client';

import { useRate } from '@/hooks/use-rate';
import { useUser, useIsLoading } from '@/stores/app-store';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardPage() {
  const user = useUser();
  const isLoading = useIsLoading();
  const { rate, isLoading: rateLoading } = useRate();

  if (isLoading || rateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen p-4 safe-top safe-bottom">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gradient-gold mb-2">
              GASH Swap
            </h1>
            <p className="text-light-600">Synthetic Gold Trading</p>
          </div>

          {/* User Info Card */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Wallet</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-light-600">WLD Balance</span>
                <span className="font-semibold text-primary-500">
                  {user?.wldBalance?.toFixed(4) || '0.0000'} WLD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-600">GASH Balance</span>
                <span className="font-semibold text-gold-500">
                  {user?.gashBalance?.toFixed(2) || '0.00'} GASH
                </span>
              </div>
            </div>
          </div>

          {/* Rate Card */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Current Rate</h2>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient-primary mb-2">
                1 WLD = {rate?.rate?.toFixed(2) || '10.00'} GASH
              </div>
              <div className="text-sm text-light-500">
                Updated:{' '}
                {rate?.updatedAt
                  ? new Date(rate.updatedAt).toLocaleTimeString()
                  : 'Loading...'}
              </div>
            </div>
          </div>

          {/* Swap Form Placeholder */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Swap WLD → GASH</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-600 mb-2">
                  Amount (WLD)
                </label>
                <input
                  type="number"
                  placeholder="0.0"
                  className="input-primary w-full"
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div className="text-sm text-light-500">
                You will receive: ~0.00 GASH
              </div>
              <button className="btn-gold w-full" disabled>
                Connect World ID to Swap
              </button>
            </div>
          </div>

          {/* Vault Preview */}
          <div className="card-glow">
            <h2 className="text-lg font-semibold mb-4 text-gradient-gold">
              🏦 GASH Vault
            </h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-500 mb-2">
                {user?.gashBalance?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-light-600">Total GASH Holdings</div>
              <div className="text-xs text-light-500 mt-2">
                ≈ ${((user?.gashBalance || 0) * 65).toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
