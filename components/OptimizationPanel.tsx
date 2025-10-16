import React from 'react';
import { OptimizationSuggestion, SuggestionSeverity } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import PerformanceGauge from './PerformanceGauge';

interface OptimizationPanelProps {
  suggestions: OptimizationSuggestion[];
}

const severityConfig: Record<SuggestionSeverity, {
  color: string;
  borderColor: string;
  title: string;
}> = {
    [SuggestionSeverity.CRITICAL]: { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        borderColor: 'border-red-500/50',
        title: 'Critical'
    },
    [SuggestionSeverity.MODERATE]: { 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        borderColor: 'border-yellow-500/50',
        title: 'Moderate'
    },
    [SuggestionSeverity.GOOD]: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        borderColor: 'border-green-500/50',
        title: 'Good Practice'
    },
};

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({ suggestions }) => {
  const calculateScore = () => {
    if (suggestions.length === 0) return 0;
    let score = 100;
    suggestions.forEach(s => {
      if (s.severity === SuggestionSeverity.CRITICAL) score -= 15;
      else if (s.severity === SuggestionSeverity.MODERATE) score -= 5;
    });
    return Math.max(0, score);
  };
  
  const score = calculateScore();

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
         <SparklesIcon className="w-16 h-16 mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-center">AI Optimization Suggestions</h3>
        <p className="text-center">Analyze a schema to see AI-powered recommendations here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
            <PerformanceGauge score={score} />
            <h2 className="text-xl font-bold mt-4 text-gray-800 dark:text-white">Optimization Report</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Based on AI analysis of your schema.</p>
        </div>
      
      <div className="space-y-4">
        {suggestions.map((item, index) => (
          <div key={index} className={`p-4 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-800/50 ${severityConfig[item.severity]?.borderColor || 'border-gray-500'}`}>
            <div className="flex items-center mb-2">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${severityConfig[item.severity]?.color || 'bg-gray-200'}`}>
                {severityConfig[item.severity]?.title || item.severity}
              </span>
            </div>
            <h4 className="font-semibold text-md text-gray-900 dark:text-white mb-1">{item.suggestion}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptimizationPanel;