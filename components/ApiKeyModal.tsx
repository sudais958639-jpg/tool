import React, { useState, useEffect } from 'react';
import { Key, Save, X, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) setKey(stored);
  }, [isOpen]);

  const handleSave = () => {
    if (key.trim()) {
        localStorage.setItem('gemini_api_key', key.trim());
        // Optional: Trigger a reload or state update if needed, 
        // but usually fetching from localStorage on demand works.
        onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-600" /> API Configuration
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
        
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          To use AI features (Chat, Image Generation, Code Builder), you need a free <strong>Google Gemini API Key</strong>.
        </p>
        
        <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your API Key</label>
            <input 
              type="password" 
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
            />
        </div>

        <div className="flex justify-between items-center pt-2">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs text-brand-600 hover:underline flex items-center gap-1 font-medium"
          >
            Get API Key <ExternalLink className="w-3 h-3" />
          </a>
          <button 
            onClick={handleSave} 
            className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 flex items-center gap-2 transition shadow-md hover:shadow-lg"
          >
            <Save className="w-4 h-4" /> Save Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;