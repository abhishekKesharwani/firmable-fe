import React from 'react';
import { Building2, AlertCircle, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  apiHealthy: boolean;
}

const Header: React.FC<HeaderProps> = ({ apiHealthy }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Company Search Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Discover and explore companies across various industries
              </p>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>


            {/* Settings placeholder */}
            <button
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Status Indicator */}
        {!apiHealthy && (
          <div className="mt-3 flex items-center space-x-2 text-sm">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-600 dark:text-yellow-400">
              API connection issues detected
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;