import React, { useState } from 'react';
import { Upload, Copy, Check } from 'lucide-react';

const ImageBase64: React.FC = () => {
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = () => {
    if (base64) {
      navigator.clipboard.writeText(base64);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <div className="mb-8 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors relative">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center pointer-events-none">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Click or Drag Image Here</h3>
          <p className="text-slate-500 text-sm mt-2">Supports JPG, PNG, GIF, SVG</p>
          {fileName && <p className="mt-4 text-brand-600 font-medium bg-brand-50 px-3 py-1 rounded-full text-sm">{fileName}</p>}
        </div>
      </div>

      {base64 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="font-semibold text-slate-700">Base64 Output</h3>
             <button 
               onClick={handleCopy}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
             >
               {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
               {copied ? 'Copied!' : 'Copy to Clipboard'}
             </button>
          </div>
          <textarea 
            value={base64}
            readOnly
            className="w-full h-48 p-4 bg-slate-900 text-slate-300 font-mono text-xs rounded-lg resize-none focus:outline-none"
          />
          
          <div className="mt-6">
             <h3 className="font-semibold text-slate-700 mb-2">Preview</h3>
             <img src={base64} alt="Preview" className="max-w-xs max-h-48 rounded border border-slate-200 p-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageBase64;