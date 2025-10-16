import React from 'react';
import DiagramIcon from './icons/DiagramIcon';
import SqlIcon from './icons/SqlIcon';
import AiIcon from './icons/AiIcon';
import SettingsIcon from './icons/SettingsIcon';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const SidebarButton = ({ label, icon, isActive, onClick }: { label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; }) => (
  <button
    onClick={onClick}
    className={`relative group flex justify-center items-center w-12 h-12 rounded-lg transition-colors duration-200 ${isActive ? 'bg-primary-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
  >
    {icon}
    <span className="absolute left-full ml-4 px-2 py-1 text-sm font-medium text-white bg-gray-900 dark:bg-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {label}
    </span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="p-2 bg-white dark:bg-gray-800/50 flex flex-col items-center space-y-4 border-r border-gray-200 dark:border-gray-700">
      <nav className="flex flex-col space-y-2">
        <SidebarButton label="ER Diagram" icon={<DiagramIcon className="w-6 h-6" />} isActive={activeView === 'ER'} onClick={() => setActiveView('ER')} />
        <SidebarButton label="SQL Editor" icon={<SqlIcon className="w-6 h-6" />} isActive={activeView === 'SQL'} onClick={() => setActiveView('SQL')} />
        <SidebarButton label="AI Optimizer" icon={<AiIcon className="w-6 h-6" />} isActive={activeView === 'AI'} onClick={() => setActiveView('AI')} />
      </nav>
      <div className="flex-grow"></div>
      <div className="flex flex-col space-y-2">
        <SidebarButton label="Settings" icon={<SettingsIcon className="w-6 h-6" />} isActive={activeView === 'Settings'} onClick={() => {}} />
      </div>
    </aside>
  );
};

export default Sidebar;
