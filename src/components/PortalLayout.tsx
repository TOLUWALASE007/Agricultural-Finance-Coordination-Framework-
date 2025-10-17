import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface PortalLayoutProps {
  role: string;
  roleIcon: string;
  sidebarItems: Array<{
    id: string;
    name: string;
    icon: string;
    href?: string;
    onClick?: () => void;
  }>;
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({
  role,
  roleIcon,
  sidebarItems,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700">
          <div className="flex items-center">
            <img 
              src="/images/logo/LOGO.svg" 
              alt="AFCF Logo" 
              className="h-8 w-auto"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Role Header */}
        <div className="px-4 py-6 border-b border-primary-700">
          <div className="flex items-center">
            <div className="text-2xl mr-3">{roleIcon}</div>
            <div>
              <h2 className="text-lg font-semibold font-sans text-gray-100">{role}</h2>
              <p className="text-sm text-gray-400 font-serif">Portal Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-700 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="font-sans">{item.name}</span>
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="flex items-center w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-primary-700 rounded-lg transition-colors duration-200 text-left"
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span className="font-sans">{item.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors duration-200"
          >
            <span className="text-lg mr-3">🚪</span>
            <span className="font-sans">Logout</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="bg-primary-800 border-b border-primary-700 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium font-sans text-gray-100">Welcome back</p>
                <p className="text-xs text-gray-400 font-serif">Last login: Today</p>
              </div>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{role.charAt(0)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PortalLayout;
