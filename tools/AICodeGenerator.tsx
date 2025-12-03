
import React, { useState } from 'react';
import { Sparkles, Play, Code2, Download, Copy, RefreshCw, Check, Zap, Trash2 } from 'lucide-react';
import { generateCodeSnippet } from '../services/gemini';

const AICodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const EXAMPLES = [
    "A scientific calculator with history",
    "A pomodoro timer with notifications",
    "A weather dashboard card",
    "A markdown editor with live preview",
    "A password strength checker"
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    const result = await generateCodeSnippet(prompt);
    setCode(result);
    setLoading(false);
    setPreviewKey(k => k + 1);
  };

  const handleUpdatePreview = () => {
    setPreviewKey(k => k + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-tool.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
      setPrompt('');
      setCode('');
  };

  return (
    <div className="space-y-6">
       {/* Input Section */}
       <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-2xl text-white shadow-xl">
         <div className="flex items-center gap-3 mb-4">
           <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
             <Sparkles className="w-6 h-6 text-yellow-300" />
           </div>
           <h2 className="text-2xl font-bold">AI Tool Builder</h2>
         </div>
         <p className="mb-6 text-indigo-100 text-lg">Describe the tool you want, and watch AI build it in seconds.</p>
         
         <div className="flex flex-col sm:flex-row gap-2 mb-4">
           <input 
             type="text" 
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder="e.g., A currency converter with real-time rates..."
             className="flex-1 p-4 rounded-xl text-slate-800 border-0 focus:ring-4 focus:ring-indigo-400/50 outline-none text-lg shadow-inner w-full"
             onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
           />
           <div className="flex gap-2">
               <button 
                 onClick={handleClear}
                 className="bg-white/10 hover:bg-white/20 text-white px-4 py-4 rounded-xl font-bold transition flex items-center justify-center border border-white/10"
                 title="Clear Input"
               >
                 <Trash2 className="w-5 h-5" />
               </button>
               <button 
                 onClick={handleGenerate} 
                 disabled={loading}
                 className="flex-1 sm:flex-none bg-yellow-400 text-indigo-950 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg whitespace-nowrap"
               >
                 {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Play className="w-5 h-5" /> Build</>}
               </button>
           </div>
         </div>

         <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-indigo-200 uppercase tracking-wide">Try:</span>
            {EXAMPLES.map(ex => (
                <button 
                    key={ex} 
                    onClick={() => setPrompt(ex)}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition text-indigo-50 border border-white/10"
                >
                    {ex}
                </button>
            ))}
         </div>
       </div>

       {/* Editor & Preview Section */}
       {code && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
           {/* Code Editor */}
           <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg flex flex-col border border-slate-700">
             <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
               <div className="flex items-center gap-2">
                 <Code2 className="w-4 h-4 text-blue-400" />
                 <span className="text-sm font-bold text-slate-300">Generated Source</span>
               </div>
               <div className="flex gap-2">
                 <button onClick={handleCopy} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition" title="Copy Code">
                    {copied ? <Check className="w-4 h-4 text-green-400"/> : <Copy className="w-4 h-4"/>}
                 </button>
                 <button onClick={handleDownload} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition" title="Download HTML">
                    <Download className="w-4 h-4"/>
                 </button>
               </div>
             </div>
             <textarea 
               value={code}
               onChange={(e) => setCode(e.target.value)}
               className="flex-1 w-full p-4 bg-[#0d1117] text-slate-300 font-mono text-xs resize-none focus:outline-none leading-relaxed"
               spellCheck={false}
             />
             <div className="bg-slate-800 p-2 text-right border-t border-slate-700">
                <button 
                    onClick={handleUpdatePreview}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium transition flex items-center gap-2 ml-auto"
                >
                    <RefreshCw className="w-3 h-3" /> Update Preview
                </button>
             </div>
           </div>

           {/* Live Preview */}
           <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full">
             <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
               <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   <span className="text-xs font-medium text-slate-500 ml-2 uppercase tracking-wider">Live Preview</span>
               </div>
               {loading && <div className="text-xs text-brand-600 font-medium animate-pulse flex items-center gap-1"><Zap className="w-3 h-3"/> Generating...</div>}
             </div>
             <div className="flex-1 relative bg-white">
               <iframe 
                 key={previewKey}
                 title="Preview"
                 className="w-full h-full absolute inset-0 border-0"
                 srcDoc={code}
                 sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
               />
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default AICodeGenerator;