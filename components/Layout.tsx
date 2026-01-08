
import React from 'react';
import { User, UserRole } from '../types';
import { mockApi } from '../services/mockApi';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                StoreRate Pro
              </span>
              <div className="ml-8 hidden md:flex items-center space-x-4">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right mr-4 hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <button
                onClick={onLogout}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        &copy; 2024 StoreRate Pro. All rights reserved. Built for Excellence.
      </footer>
    </div>
  );
};

export default Layout;
