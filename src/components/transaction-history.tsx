'use client';

import { useState } from 'react';
import type { Transaction } from '@/types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionHistory({
  transactions,
  isLoading,
}: TransactionHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Paginate transactions
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTxHash = (hash: string) => {
    if (hash.length <= 10) return hash;
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-light-600">
        <div className="text-4xl mb-2">🏦</div>
        <p>No transaction history yet</p>
        <p className="text-sm mt-1">Your transactions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-y-auto scrollbar-thin max-h-[300px]">
        {paginatedTransactions.map(transaction => (
          <div
            key={transaction.id}
            className="border-b border-light-200 last:border-0 py-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-light-900">
                  {formatDate(transaction.timestamp)}
                </div>
                <div className="text-sm text-light-600 mt-1">
                  <span className="font-medium">
                    {transaction.amountWLD.toFixed(2)} WLD
                  </span>{' '}
                  →{' '}
                  <span className="font-medium text-gold-500">
                    {transaction.amountGASH.toFixed(2)} GASH
                  </span>
                  {transaction.bonusGASH > 0 && (
                    <span className="text-xs bg-gold-500/20 text-gold-500 ml-2 px-1 py-0.5 rounded">
                      +{transaction.bonusGASH.toFixed(2)} bonus
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <a
                  href={`https://worldcoin.org/tx/${transaction.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-500 hover:text-primary-600 break-all"
                >
                  {formatTxHash(transaction.txHash)}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-light-200 disabled:opacity-50"
          >
            ←
          </button>

          <span className="text-sm text-light-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage(prev => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-light-200 disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
