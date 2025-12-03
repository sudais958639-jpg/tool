
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Send, Image as ImageIcon, FileText, Copy, Download, RefreshCw, User, Bot, Sparkles, Trash2, Check, Clock, AlertCircle, MessageSquare, Plus, Menu, X, History, Code2 } from 'lucide-react';
import { generateImage, generateCodeSnippet, getApiKey } from '../services/gemini';
import { v4 as uuidv4 } from 'uuid';

// --- TYPES ---
interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastModified: number;
}

// --- AI CHAT ASSISTANT ---
export const AIChat: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize: Load history
  useEffect(() => {
    const saved = localStorage.getItem('toolmaster_chat_history');
    if (saved) {
      try {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sort by last modified desc
          const sorted = parsed.sort((a, b) => b.lastModified - a.lastModified);
          setSessions(sorted);
          setCurrentId(sorted[0].id);
          return;
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    // Default to new session if empty
    createNewSession();
  }, []);

  // Persistence: Save history whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('toolmaster_chat_history', JSON.stringify(sessions));
    } else {
        localStorage.removeItem('toolmaster_chat_history');
    }
  }, [sessions]);

  // Context Restoration: When switching sessions, re-init the AI chat with history
  useEffect(() => {
    if (currentId) {
      const session = sessions.find(s => s.id === currentId);
      if (session) {
        initializeChatWithHistory(session.messages);
      }
    }
  }, [currentId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, currentId, loading]);

  const initializeChatWithHistory = (historyMsgs: ChatMessage[]) => {
    try {
        const apiKey = localStorage.getItem('gemini_api_key') || process.env.API_KEY;
        if (!apiKey) {
             setError('API Key is missing. Please set it in Settings.');
             return;
        }

        const ai = new GoogleGenAI({ apiKey });
        
        // Convert stored messages to Gemini history format
        const history = historyMsgs
            .filter(m => m.text.trim() !== '')
            .map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: 'You are a helpful, friendly, and intelligent AI assistant called ToolMaster AI. Provide clear, concise, and accurate answers. Use markdown formatting for code and lists where appropriate.',
          },
          history: history
        });
        setError('');
    } catch (e) {
        console.error("Chat init failed", e);
        setError('Failed to initialize AI. Check API Key.');
    }
  };

  const createNewSession = () => {
    const id = uuidv4();
    const newSession: ChatSession = {
      id,
      title: 'New Chat',
      messages: [],
      lastModified: Date.now(),
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentId(id);
    setSidebarOpen(false);
    initializeChatWithHistory([]);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;

    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    
    if (currentId === id) {
      if (newSessions.length > 0) {
        setCurrentId(newSessions[0].id);
      } else {
        // If we deleted the last one, create a fresh one immediately
        const newId = uuidv4();
        const newSession: ChatSession = {
            id: newId,
            title: 'New Chat',
            messages: [],
            lastModified: Date.now(),
        };
        setSessions([newSession]);
        setCurrentId(newId);
        initializeChatWithHistory([]);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!chatRef.current) initializeChatWithHistory([]);
    
    const userText = input;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setInput('');
    setError('');
    setLoading(true);

    // 1. Optimistic Update: Add User Message
    const userMsg: ChatMessage = { role: 'user', text: userText, timestamp };
    
    setSessions(prev => prev.map(s => {
        if (s.id === currentId) {
            // Auto-title if it's the first message
            const title = s.messages.length === 0 ? (userText.slice(0, 30) + (userText.length > 30 ? '...' : '')) : s.title;
            return {
                ...s,
                title,
                messages: [...s.messages, userMsg],
                lastModified: Date.now()
            };
        }
        return s;
    }));

    try {
      // 2. Stream Response
      const response = await chatRef.current?.sendMessageStream({ message: userText });
      
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let fullText = '';
      
      // Placeholder for AI message
      setSessions(prev => prev.map(s => {
          if (s.id === currentId) {
              return {
                  ...s,
                  messages: [...s.messages, { role: 'model', text: '', timestamp: aiTimestamp }]
              };
          }
          return s;
      }));

      if (response) {
          for await (const chunk of response) {
              const c = chunk as GenerateContentResponse;
              if (c.text) {
                  fullText += c.text;
                  
                  // Update the last message (AI response)
                  setSessions(prev => prev.map(s => {
                      if (s.id === currentId) {
                          const msgs = [...s.messages];
                          const lastIdx = msgs.length - 1;
                          if (lastIdx >= 0) {
                              msgs[lastIdx] = { ...msgs[lastIdx], text: fullText };
                          }
                          return { ...s, messages: msgs };
                      }
                      return s;
                  }));
              }
          }
      }
    } catch (e) {
      console.error(e);
      setError('Failed to get response. Please check your connection or API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMsg = (text: string, idx: number) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
  }

  const currentSession = sessions.find(s => s.id === currentId);
  const messages = currentSession?.messages || [];

  return (
    <div className="flex h-[600px] md:h-[700px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
      
      {/* SIDEBAR (History) */}
      <div className={`
        absolute inset-y-0 left-0 z-20 w-72 bg-slate-50 border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
         <div className="flex flex-col h-full">
             <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2">
                     <History className="w-4 h-4" /> History
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
                     <Plus className="w-4 h-4" /> New Chat
                 </button>
             </div>

             <div className="flex-1 overflow-y-auto p-3 space-y-1">
                 {sessions.map(s => (
                     <div 
                        key={s.id}
                        onClick={() => { setCurrentId(s.id); setSidebarOpen(false); }}
                        className={`
                            group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition text-sm
                            ${currentId === s.id ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-slate-200/50 text-slate-600'}
                        `}
                     >
                         <MessageSquare className={`w-4 h-4 shrink-0 ${currentId === s.id ? 'text-brand-600' : 'text-slate-400'}`} />
                         <div className="flex-1 truncate font-medium">
                             {s.title}
                         </div>
                         <button 
                            onClick={(e) => deleteSession(e, s.id)}
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 rounded transition"
                            title="Delete Chat"
                         >
                             <Trash2 className="w-3.5 h-3.5" />
                         </button>
                     </div>
                 ))}
                 {sessions.length === 0 && (
                     <div className="text-center text-xs text-slate-400 py-4">No history yet</div>
                 )}
             </div>
         </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white z-10 shrink-0">
              <div className="flex items-center gap-3">
                  <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                      <Menu className="w-5 h-5" />
                  </button>
                  <div className="p-2 bg-gradient-to-tr from-brand-500 to-purple-600 rounded-lg text-white shadow-md">
                      <Bot className="w-5 h-5" />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800 text-sm md:text-base truncate max-w-[150px] md:max-w-xs">
                          {currentSession?.title || 'ToolMaster Assistant'}
                      </h3>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                      </p>
                  </div>
              </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 scroll-smooth">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-8 opacity-60">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-brand-400" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-600 mb-2">How can I help you today?</h3>
                 <p className="max-w-xs text-sm">Ask me about code, math, writing, or any other task. I'm here to assist!</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 {/* Avatar */}
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-brand-600'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                 </div>

                 {/* Bubble */}
                 <div className={`max-w-[85%] sm:max-w-[75%]`}>
                    <div className={`relative p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-slate-800 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                    }`}>
                        <div className="whitespace-pre-wrap font-normal overflow-x-auto">{msg.text}</div>
                        
                        {/* Copy Action (AI only) */}
                        {msg.role === 'model' && (
                            <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button 
                                    onClick={() => handleCopyMsg(msg.text, idx)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 transition text-xs flex items-center gap-1"
                                >
                                    {copiedIndex === idx ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                    {copiedIndex === idx ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-[10px] text-slate-400 mt-1 flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.timestamp}
                    </div>
                 </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                 </div>
                 <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-150"></div>
                 </div>
              </div>
            )}
            
            {error && (
                <div className="flex justify-center">
                    <div className="bg-red-50 text-red-600 text-xs px-4 py-2 rounded-full flex items-center gap-2 border border-red-100">
                        <AlertCircle className="w-3 h-3" /> {error}
                    </div>
                </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
             <div className="relative flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message here..."
                  className="flex-1 pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition shadow-inner"
                  disabled={loading}
                  autoFocus
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-brand-600 text-white px-5 rounded-xl hover:bg-brand-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
             </div>
             <div className="text-center mt-2">
                 <p className="text-[10px] text-slate-400">AI can make mistakes. Please verify important information.</p>
             </div>
          </div>
      </div>
    </div>
  );
};

// --- AI IMAGE GENERATOR ---
export const AIImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setImage(null);
    
    const result = await generateImage(prompt);
    if (result) {
        setImage(result);
    } else {
        setError('Failed to generate image. Please check your API Key.');
    }
    setLoading(false);
  };

  const handleDownload = () => {
      if (!image) return;
      const link = document.createElement('a');
      link.href = image;
      link.download = `generated-image-${Date.now()}.png`;
      link.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Describe Your Imagination</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  className="flex-1 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-lg"
                  placeholder="e.g. A futuristic city on Mars..."
                />
                <button 
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg hover:shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Generate
                </button>
            </div>
            {error && <div className="mt-4 text-red-600 text-sm flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> {error}</div>}
        </div>

        {image && (
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
                <img src={image} alt={prompt} className="w-full rounded-xl shadow-sm" />
                <div className="flex justify-between items-center mt-4 px-2">
                    <p className="text-slate-500 text-sm italic truncate max-w-md">"{prompt}"</p>
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
                    >
                        <Download className="w-4 h-4" /> Download
                    </button>
                </div>
            </div>
        )}
        {!image && !loading && (
            <div className="text-center py-12 text-slate-400">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Enter a prompt above to generate an AI image</p>
            </div>
        )}
        {loading && (
            <div className="text-center py-20">
                 <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-purple-600 font-medium">Creating masterpiece...</p>
            </div>
        )}
    </div>
  );
};

// --- AI SUMMARIZER ---
export const AISummarizer: React.FC = () => {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSummary('');
    
    try {
        const apiKey = localStorage.getItem('gemini_api_key') || process.env.API_KEY;
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Please summarize the following text concisely, highlighting key points:\n\n"${input}"`,
        });
        setSummary(response.text || 'Could not generate summary.');
    } catch (e) {
        setSummary('Error generating summary. Please check API Key settings.');
    } finally {
        setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto md:h-[600px] h-auto">
        <div className="flex flex-col h-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" /> Input Text
             </h3>
             <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none text-slate-700 leading-relaxed"
                placeholder="Paste text or article here..."
             />
             <div className="mt-4 flex justify-end gap-3">
                 <button onClick={() => setInput('')} className="text-slate-500 hover:text-red-600 px-4 py-2 transition text-sm font-medium">Clear</button>
                 <button 
                    onClick={handleSummarize} 
                    disabled={!input.trim() || loading}
                    className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
                 >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Summarize
                 </button>
             </div>
        </div>

        <div className="flex flex-col h-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" /> AI Summary
             </h3>
             <textarea 
                readOnly
                value={summary}
                className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none text-slate-700 leading-relaxed"
                placeholder="Summary will appear here..."
             />
             <div className="mt-4 flex justify-end gap-3">
                 <button 
                    onClick={handleCopy}
                    disabled={!summary}
                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition flex items-center gap-2 disabled:opacity-50"
                 >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                 </button>
             </div>
        </div>
    </div>
  );
};
