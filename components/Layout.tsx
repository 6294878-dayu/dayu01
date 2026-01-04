
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-camera-retro"></i>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-400 bg-clip-text text-transparent">
              Floral Celeb AI
            </h1>
          </div>
          <div className="text-xs text-gray-400 hidden sm:block">
            您的私人专业花卉摄影室
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-4xl mx-auto w-full p-4 sm:p-6 pb-24">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
        &copy; 2024 Floral Celeb AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
