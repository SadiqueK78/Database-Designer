import React, { useState, useEffect, useCallback, useRef } from 'react';
import { OptimizationSuggestion, ERFile } from './types';
import { generateSqlFromEr, generateErFromSql, getOptimizationSuggestions } from './services/geminiService';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Panel from './components/Panel';
import SQLEditor from './components/SQLEditor';
import ERDiagram from './components/ERDiagram';
import OptimizationPanel from './components/OptimizationPanel';
import DashboardDescription from './components/DashboardDescription';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeView, setActiveView] = useState('ER'); // ER, SQL, AI
  
  const [erFile, setErFile] = useState<ERFile | null>(null);
  const [erText, setErText] = useState('');
  const [sqlSchema, setSqlSchema] = useState('');
  const [mermaidSyntax, setMermaidSyntax] = useState('');
  const [optimizations, setOptimizations] = useState<OptimizationSuggestion[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (file.type.startsWith('image/')) {
          const base64Content = content.split(',')[1];
          setErFile({ name: file.name, type: file.type, content: base64Content });
          setErText(''); // Clear text input if image is uploaded
        } else {
          setErText(content);
          setErFile(null); // Clear file input if text is used
        }
        setActiveView('ER');
      };
      if (file.type.startsWith('image/')) {
         reader.readAsDataURL(file);
      } else {
         reader.readAsText(file);
      }
    }
    event.target.value = ''; // Reset file input
  };
  
  const handleGenerateSql = useCallback(async () => {
    const input = erFile || (erText ? { name: 'text-input', type: 'text/plain', content: erText } : null);
    if (!input) {
      setError('Please upload or provide an ER diagram description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSqlSchema('');
    try {
      const result = await generateSqlFromEr(input);
      setSqlSchema(result);
      setActiveView('SQL');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [erFile, erText]);

  const handleGenerateEr = useCallback(async () => {
    if (!sqlSchema) {
      setError('Please provide an SQL schema.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMermaidSyntax('');
    try {
      const result = await generateErFromSql(sqlSchema);
      setMermaidSyntax(result);
      setActiveView('ER');
    } catch (e: any)
{
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [sqlSchema]);

  const handleOptimize = useCallback(async () => {
    if (!sqlSchema) {
      setError('Please provide an SQL schema to optimize.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOptimizations([]);
    try {
      const result = await getOptimizationSuggestions(sqlSchema);
      setOptimizations(result);
      setActiveView('AI');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [sqlSchema]);
  
  const handleExport = () => {
    let content = '';
    let filename = 'export.txt';
    let mimeType = 'text/plain';

    if(activeView === 'SQL' && sqlSchema){
        content = sqlSchema;
        filename = 'schema.sql';
        mimeType = 'application/sql';
    } else if(activeView === 'ER' && mermaidSyntax){
        content = mermaidSyntax;
        filename = 'diagram.txt';
        mimeType = 'text/plain';
    } else if(activeView === 'AI' && optimizations.length > 0){
        content = JSON.stringify(optimizations, null, 2);
        filename = 'optimizations.json';
        mimeType = 'application/json';
    } else {
        setError("Nothing to export in the current view.");
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'ER':
        return (
          <>
            <Panel title="ER Diagram Input / Output">
              <ERDiagram chart={mermaidSyntax} />
            </Panel>
            <Panel title="Dashboard & Instructions">
              <DashboardDescription onUploadClick={() => fileInputRef.current?.click()} />
            </Panel>
          </>
        );
      case 'SQL':
        return (
          <>
            <Panel title="SQL Schema Editor">
              <SQLEditor value={sqlSchema} onChange={setSqlSchema} placeholder="Paste or generate SQL schema here..."/>
            </Panel>
            <Panel title="AI Optimization Analysis">
              <OptimizationPanel suggestions={optimizations} />
            </Panel>
          </>
        );
      case 'AI':
         return (
          <>
            <Panel title="AI Optimization Analysis">
              <OptimizationPanel suggestions={optimizations} />
            </Panel>
            <Panel title="SQL Schema">
               <SQLEditor value={sqlSchema} onChange={setSqlSchema} readOnly={true} placeholder="The SQL schema being analyzed will appear here."/>
            </Panel>
          </>
        );
      default:
        return null;
    }
  };


  return (
    <div className="h-screen flex flex-col text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 transition-colors font-sans">
       <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/png, image/jpeg, .json, .txt, .md, .sql" />
       <Header 
         theme={theme} 
         setTheme={setTheme}
         onGenerateSql={handleGenerateSql}
         onGenerateEr={handleGenerateEr}
         onOptimize={handleOptimize}
         // FIX: Corrected typo from `fileInput-ref` to `fileInputRef`.
         onUpload={() => fileInputRef.current?.click()}
         onExport={handleExport}
         isLoading={isLoading}
         activeView={activeView}
        />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-grow flex flex-col p-4 overflow-y-auto">
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center flex justify-between items-center dark:bg-red-900/50 dark:border-red-600 dark:text-red-200">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="font-bold text-red-800 dark:text-red-200">&times;</button>
                </div>
            )}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
                {renderMainContent()}
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;