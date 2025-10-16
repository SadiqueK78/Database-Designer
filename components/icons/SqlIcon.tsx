import React from 'react';

const SqlIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1 1 15 0m-15 0h1.5m12 0h1.5m-15 0a7.5 7.5 0 0 1 15 0m-15 0h1.5m12 0h1.5" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75v10.5" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6.75v10.5" />
</svg>
);

export default SqlIcon;