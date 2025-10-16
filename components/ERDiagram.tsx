import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import DiagramIcon from './icons/DiagramIcon';

interface ERDiagramProps {
  chart: string;
}

const ERDiagram: React.FC<ERDiagramProps> = ({ chart }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mermaidRef.current && chart) {
        mermaid.initialize({
            startOnLoad: false,
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
            er: {
                useMaxWidth: true
            }
        });
        
        mermaidRef.current.innerHTML = chart;
        mermaidRef.current.removeAttribute('data-processed');
        
        mermaid.run({ nodes: [mermaidRef.current] });
    }
  }, [chart]);

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner overflow-auto">
        {chart ? (
             <div ref={mermaidRef} className="mermaid w-full h-full text-gray-800 dark:text-gray-200 flex items-center justify-center">
                {chart}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4">
                <DiagramIcon className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">ER Diagram Viewer</h3>
                <p className="max-w-sm mt-1">Your generated entity-relationship diagrams will appear here. Upload an existing diagram or generate one from an SQL schema to get started.</p>
            </div>
        )}
    </div>
  );
};

export default ERDiagram;