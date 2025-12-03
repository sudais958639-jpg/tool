
import React, { useState, useRef, useEffect } from 'react';
import { Plug, Send, Download, Copy, Check, FileCode, RefreshCw, MessageSquare, User, Bot, Sparkles, Trash2, Zap, AlertCircle, RotateCcw, History, Plus, Menu, X, Search } from 'lucide-react';
import { refinePluginCode } from '../services/gemini';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'ai';
  text: string;
  isCodeUpdate?: boolean;
}

interface PluginSession {
  id: string;
  name: string;
  description: string;
  code: string;
  messages: Message[];
  lastModified: number;
}

const PluginBuilder: React.FC = () => {
  // Session State
  const [sessions, setSessions] = useState<PluginSession[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active Workspace State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [code, setCode] = useState('');
  
  // UI State
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- HISTORY MANAGEMENT ---

  // 1. Initial Load
  useEffect(() => {
    const saved = localStorage.getItem('toolmaster_plugin_history');
    if (saved) {
      try {
        const parsed: PluginSession[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sorted = parsed.sort((a, b) => b.lastModified - a.lastModified);
          setSessions(sorted);
          loadSession(sorted[0]);
          return;
        }
      } catch (e) { console.error("Failed to load history", e); }
    }
    // No history? Create new.
    createNewSession();
  }, []);

  // 2. Persist to LocalStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('toolmaster_plugin_history', JSON.stringify(sessions));
    } else {
      localStorage.removeItem('toolmaster_plugin_history');
    }
  }, [sessions]);

  // 3. Auto-save current work to session list (Debounced)
  useEffect(() => {
    if (!currentId) return;

    const timer = setTimeout(() => {
      setSessions(prev => prev.map(s => 
        s.id === currentId 
          ? { ...s, name, description, code, messages, lastModified: Date.now() }
          : s
      ));
    }, 500);

    return () => clearTimeout(timer);
  }, [name, description, code, messages, currentId]);

  // --- ACTIONS ---

  const loadSession = (session: PluginSession) => {
    setCurrentId(session.id);
    setName(session.name);
    setDescription(session.description);
    setCode(session.code);
    setMessages(session.messages);
    setSidebarOpen(false);
  };

  const createNewSession = () => {
    const id = uuidv4();
    const newSession: PluginSession = {
        id,
        name: '',
        description: '',
        code: '',
        messages: [{ role: 'ai', text: "Hi! I'm your WordPress Plugin Architect. Give me a name and description, then tell me what features you want!" }],
        lastModified: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    loadSession(newSession);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this plugin project?")) {
        const filtered = sessions.filter(s => s.id !== id);
        
        if (filtered.length === 0) {
            // If we deleted the last one, reset to a fresh state immediately
            const newId = uuidv4();
            const newSession: PluginSession = {
                id: newId,
                name: '',
                description: '',
                code: '',
                messages: [{ role: 'ai', text: "Hi! I'm your WordPress Plugin Architect. Give me a name and description, then tell me what features you want!" }],
                lastModified: Date.now()
            };
            setSessions([newSession]);
            loadSession(newSession);
        } else {
            setSessions(filtered);
            // If we deleted the currently active session, switch to the first available one
            if (currentId === id) {
                loadSession(filtered[0]);
            }
        }
    }
  };

  const handleClearChat = () => {
      if (window.confirm("Clear chat history? Your code will be preserved.")) {
          setMessages([{ role: 'ai', text: "Chat cleared. I still remember the code we're working on." }]);
      }
  };

  // --- CHAT LOGIC ---

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Validation for first interaction
    if (!name.trim() && messages.length <= 1) {
        setMessages(prev => [...prev, 
            { role: 'user', text: input },
            { role: 'ai', text: "Please enter a Plugin Name in the top field before we start building." }
        ]);
        setInput('');
        return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
        const result = await refinePluginCode(code, userMsg, { 
            name: name || 'My Plugin', 
            description: description || 'A custom WordPress plugin' 
        });

        // Update Code if present
        if (result.code) {
            setCode(result.code);
        }

        // Add Response to Chat
        setMessages(prev => [...prev, { 
            role: 'ai', 
            text: result.text, 
            isCodeUpdate: !!result.code 
        }]);

    } catch (error) {
        setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error connecting to the AI. Please check your API settings." }]);
    } finally {
        setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'custom-plugin';
    const blob = new Blob([code], { type: 'text/php' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.php`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] flex bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
      
      {/* HISTORY SIDEBAR */}
      <div className={`
        absolute inset-y-0 left-0 z-20 w-72 bg-slate-50 border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
         <div className="flex flex-col h-full">
             <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2">
                     <History className="w-4 h-4" /> My Plugins
                 </h3>
                 <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400 hover:bg-slate-200 rounded">
                     <X className="w-5 h-5" />
                 </button>
             </div>
             
             <div className="p-3">
                 <button 
                    onClick={createNewSession}
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition shadow-sm"
                 >
                     <Plus className="w-4 h-4" /> New Plugin
                 </button>
             </div>

             <div className="flex-1 overflow-y-auto p-3 space-y-1">
                 {sessions.map(s => (
                     <div 
                        key={s.id}
                        onClick={() => loadSession(s)}
                        className={`
                            group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition text-sm
                            ${currentId === s.id ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-slate-200/50 text-slate-600'}
                        `}
                     >
                         <Plug className={`w-4 h-4 shrink-0 ${currentId === s.id ? 'text-brand-600' : 'text-slate-400'}`} />
                         <div className="flex-1 min-w-0">
                             <div className="font-medium truncate">{s.name || 'Untitled Plugin'}</div>
                             <div className="text-[10px] text-slate-400 truncate">{new Date(s.lastModified).toLocaleDateString()}</div>
                         </div>
                         <button 
                            onClick={(e) => deleteSession(e, s.id)}
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 rounded transition"
                            title="Delete Plugin"
                         >
                             <Trash2 className="w-3.5 h-3.5" />
                         </button>
                     </div>
                 ))}
                 {sessions.length === 0 && (
                     <div className="text-center text-xs text-slate-400 py-4">No saved plugins</div>
                 )}
             </div>
         </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Mobile Toggle & Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-3 flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-700 truncate">{name || 'New Plugin'}</span>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 overflow-hidden">
            {/* LEFT COLUMN: INTERACTION */}
            <div className="lg:w-1/3 flex flex-col gap-4 h-full min-h-0">
                {/* Metadata Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-brand-600" /> Plugin Metadata
                        </h3>
                    </div>
                    <div className="space-y-3">
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Plugin Name (e.g. Portfolio Manager)"
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                        />
                        <input 
                            type="text" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short Description..."
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-0">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                            <MessageSquare className="w-4 h-4" /> AI Architect
                        </div>
                        <button onClick={handleClearChat} className="text-slate-400 hover:text-red-500 transition" title="Clear Chat History (Keep Code)">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-brand-100 text-brand-600'}`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-slate-800 text-white rounded-tr-none' 
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                }`}>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                    {msg.isCodeUpdate && (
                                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded w-fit">
                                            <FileCode className="w-3 h-3" /> Code Updated
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                </div>
                                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-slate-100 bg-white shrink-0">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Describe features or changes..."
                                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                disabled={loading}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="bg-brand-600 text-white p-2 rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: EDITOR */}
            <div className="lg:w-2/3 bg-slate-900 rounded-xl overflow-hidden shadow-xl flex flex-col border border-slate-700 h-full min-h-0">
                {/* Editor Toolbar */}
                <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/20 p-1.5 rounded text-blue-400">
                            <Plug className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-slate-200 font-bold text-sm block">
                                {name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'untitled-plugin'}.php
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                        onClick={handleCopy}
                        disabled={!code}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-medium transition disabled:opacity-50"
                        >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button 
                        onClick={handleDownload}
                        disabled={!code}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition disabled:opacity-50"
                        >
                        <Download className="w-3 h-3" /> Download
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 relative bg-[#0d1117] min-h-0">
                    {code ? (
                        <textarea 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full p-4 bg-transparent text-blue-100 font-mono text-xs resize-none focus:outline-none leading-relaxed"
                            spellCheck={false}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-8 text-center pointer-events-none">
                            <Plug className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-lg font-medium">Ready to Build</p>
                            <p className="text-sm opacity-50 max-w-sm mt-2">
                                Enter your plugin details and chat with the AI to generate the PHP code instantly.
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Footer Status */}
                <div className="bg-slate-800 px-4 py-2 text-[10px] text-slate-500 flex justify-between shrink-0">
                    <span>PHP 7.4+ Compatible</span>
                    <span>{code.length} chars</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PluginBuilder;
