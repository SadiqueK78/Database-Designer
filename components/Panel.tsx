import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-white">{title}</h2>
      </div>
      <div className="flex-grow p-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Panel;
