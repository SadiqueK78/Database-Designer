import React, { useState, useEffect } from 'react';
import CodeIcon from './icons/CodeIcon';
import DiagramIcon from './icons/DiagramIcon';
import SparklesIcon from './icons/SparklesIcon';
import UploadIcon from './icons/UploadIcon';
import DownloadIcon from './icons/DownloadIcon';

interface HeaderProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onGenerateSql: () => void;
  onGenerateEr: () => void;
  onOptimize: () => void;
  onUpload: () => void;
  onExport: () => void;
  isLoading: boolean;
  activeView: string;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, onGenerateSql, onGenerateEr, onOptimize, onUpload, onExport, isLoading, activeView }) => {
  const [scrolled, setScrolled] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getAction = () => {
     switch(activeView) {
        case 'ER': return { action: onGenerateSql, label: 'Generate SQL', icon: <CodeIcon className="w-5 h-5" /> };
        case 'SQL': return { action: onGenerateEr, label: 'Generate ER', icon: <DiagramIcon className="w-5 h-5" /> };
        case 'AI': return { action: onOptimize, label: 'Optimize', icon: <SparklesIcon className="w-5 h-5" /> };
        default: return null;
     }
  }

  const primaryAction = getAction();

  return (
    <header className={`sticky top-0 z-30 p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">DBSmart Designer</h1>
        </div>
        
        <div className="flex-grow flex justify-center items-center px-4">
             {primaryAction && (
                <button
                    onClick={primaryAction.action}
                    disabled={isLoading}
                    className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                >
                    {primaryAction.icon}
                    <span className="hidden md:inline">{isLoading ? 'Processing...' : primaryAction.label}</span>
                </button>
             )}
        </div>

        <div className="flex items-center space-x-2">
            <button onClick={onUpload} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Upload file">
                <UploadIcon className="w-6 h-6" />
            </button>
            <button onClick={onExport} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Export file">
                <DownloadIcon className="w-6 h-6" />
            </button>
           <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;