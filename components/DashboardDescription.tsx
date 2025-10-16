import React from 'react';
import CodeIcon from './icons/CodeIcon';
import DiagramIcon from './icons/DiagramIcon';
import SparklesIcon from './icons/SparklesIcon';
import UploadIcon from './icons/UploadIcon';

interface DashboardDescriptionProps {
    onUploadClick: () => void;
}

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg text-white shadow-lg">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{children}</p>
        </div>
    </div>
);

const DashboardDescription: React.FC<DashboardDescriptionProps> = ({ onUploadClick }) => {
  return (
    <div className="p-6 h-full flex flex-col justify-center items-start text-left bg-white dark:bg-gray-800 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to <span className="text-primary-500">DBSmart Designer</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Your AI-Powered Database Design Assistant.
        </p>

        <div className="w-full border-t border-gray-200 dark:border-gray-700 my-6"></div>

        <div className="space-y-6">
            <FeatureCard icon={<CodeIcon className="w-6 h-6" />} title="ER to SQL">
                Upload an image or text description of your ER Diagram, and let AI generate the corresponding SQL schema for you.
            </FeatureCard>
            <FeatureCard icon={<DiagramIcon className="w-6 h-6" />} title="SQL to ER">
                Paste your existing SQL schema and instantly visualize it as a clean, easy-to-understand ER Diagram.
            </FeatureCard>
            <FeatureCard icon={<SparklesIcon className="w-6 h-6" />} title="AI Optimization">
                Get expert suggestions on indexing, normalization, and query performance to build a highly efficient database.
            </FeatureCard>
        </div>

        <div className="w-full border-t border-gray-200 dark:border-gray-700 my-6"></div>

        <button 
            onClick={onUploadClick}
            className="w-full bg-accent-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-accent-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
        >
            <UploadIcon className="w-5 h-5" />
            <span>Upload Diagram to Get Started</span>
        </button>
    </div>
  );
};

export default DashboardDescription;