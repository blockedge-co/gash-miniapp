'use client';

import { useState, useEffect } from 'react';
import {
  useUser,
  useTransactions,
  fetchUserTransactions,
} from '@/stores/app-store';
import { AuthGuard } from '@/components/auth-guard';
import { TransactionHistory } from '@/components/transaction-history';
import type { Transaction } from '@/types';

export default function VaultPage() {
  const user = useUser();
  const transactions = useTransactions();

  // Fetch transactions when user changes
  useEffect(() => {
    if (user?.id) {
      fetchUserTransactions(user.id);
    }
  }, [user?.id]);

  // Calculate USD value (assuming $65 per GASH as in dashboard)
  const usdValue = (user?.gashBalance || 0) * 65;

  return (
    <AuthGuard>
      <div className="min-h-screen p-4 safe-top safe-bottom">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gradient-gold mb-2">
              GASH Vault Viewer
            </h1>
            <p className="text-light-600">
              View your accumulated GASH and swap history
            </p>
          </div>

          {/* GASH Balance Card */}
          <div className="card-glow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gradient-gold">
                GASH Holdings
              </h2>
              <div className="text-xs bg-gold-500/20 text-gold-500 px-2 py-1 rounded-full">
                Vault
              </div>
            </div>

            <div className="text-center py-4">
              <div className="text-4xl font-bold text-gold-500 mb-2">
                {user?.gashBalance?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-light-600 mb-4">
                Total GASH Balance
              </div>

              <div className="bg-light-200/50 rounded-xl p-4">
                <div className="text-sm text-light-600 mb-1">
                  Estimated Value
                </div>
                <div className="text-xl font-semibold text-light-900">
                  ${usdValue.toFixed(2)} USD
                </div>
              </div>
            </div>
          </div>

          {/* Swap History */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Swap History</h2>
              <div className="text-xs bg-primary-500/20 text-primary-500 px-2 py-1 rounded-full">
                {transactions.length} swaps
              </div>
            </div>

            <TransactionHistory transactions={transactions} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
