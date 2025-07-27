import React from 'react';
import Image from 'next/image';

interface HeaderProps {
  vaultBalance: string;
}

export const Header: React.FC<HeaderProps> = ({ vaultBalance }) => {
  return (
    <header className="bg-gray-900 text-white p-4 border-b border-gold-500">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Gash Logo"
            width={32}
            height={32}
            className="text-gold-500"
          />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-400 to-gold-600">
            Gash Vault
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gold-500/30">
            <p className="text-sm text-gray-300">Vault Balance</p>
            <p className="text-gold-400 font-mono">{vaultBalance}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
