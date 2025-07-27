import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Swap', path: '/swap' },
  { name: 'Vault', path: '/vault' },
  { name: 'History', path: '/history' },
];

export const TabBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 border-t border-gray-700">
      <div className="container mx-auto flex">
        {tabs.map(tab => (
          <Link
            key={tab.path}
            href={tab.path}
            className={`flex-1 py-4 text-center font-medium transition-colors
              ${
                pathname === tab.path
                  ? 'text-gold-500 border-t-2 border-gold-500'
                  : 'text-gray-400 hover:text-white'
              }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};
