
import React, { useState, useEffect, useRef } from 'react';
import { v1, v3, v4, v5, validate } from 'uuid';
import SparkMD5 from 'spark-md5';
import { Copy, Download, RefreshCw, Check, AlertCircle, Fingerprint, Settings, Trash2, ShieldCheck, Upload, FileCode, ArrowRight, Code, AlignLeft, FileJson, Minimize2, List, Search, Type, Scissors, AlignCenter } from 'lucide-react';
import * as beautify from 'js-beautify';

// Handle js-beautify imports safely for Vite build
const html_beautify = (beautify as any).html || (beautify as any).default?.html || (beautify as any).default;
const css_beautify = (beautify as any).css || (beautify as any).default?.css || (beautify as any).default;
const js_beautify = (beautify as any).js || (beautify as any).default?.js || (beautify as any).default;

const UUID_NAMESPACES = {
    DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
};

export const UUIDGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(1);
  const [version, setVersion] = useState<'v1' | 'v3' | 'v4' | 'v5'>('v4');
  
  const [namespaceMode, setNamespaceMode] = useState<string>('DNS');
  const [customNamespace, setCustomNamespace] = useState<string>('');
  const [name, setName] = useState<string>('example.com');
  
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setError('');
    setUuids([]);

    if (count < 1 || count > 1000) {
        setError('Please enter a valid quantity (1-1000).');
        return;
    }

    let namespaceToUse = '';
    if (version === 'v3' || version === 'v5') {
        if (!name.trim()) {
            setError('Name is required for v3/v5 generation.');
            return;
        }
        
        if (namespaceMode === 'Custom') {
            if (!validate(customNamespace)) {
                setError('Invalid custom namespace UUID.');
                return;
            }
            namespaceToUse = customNamespace;
        } else {
            // @ts-ignore
            namespaceToUse = UUID_NAMESPACES[namespaceMode];
        }
    }

    const newUuids: string[] = [];
    try {
        for (let i = 0; i < count; i++) {
            let id = '';
            switch (version) {
                case 'v1': id = v1(); break;
                case 'v4': id = v4(); break;
                case 'v3': id = v3(name, namespaceToUse); break;
                case 'v5': id = v5(name, namespaceToUse); break;
            }
            newUuids.push(id);
        }
        setUuids(newUuids);
    } catch (e) {
        setError('Error generating UUIDs. Please check inputs.');
    }
  };

  const handleCopy = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${version}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setUuids([]);
    setCount(1);
    setName('example.com');
    setError('');
    setNamespaceMode('DNS');
    setCustomNamespace('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-lg border-b border-slate-100 pb-4">
            <Settings className="w-5 h-5 text-brand-600" />
            Configuration
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Version</label>
                <select 
                    value={version} 
                    onChange={(e) => setVersion(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                >
                    <option value="v4">Version 4 (Random)</option>
                    <option value="v1">Version 1 (Time-based)</option>
                    <option value="v3">Version 3 (MD5 Name)</option>
                    <option value="v5">Version 5 (SHA-1 Name)</option>
                </select>
            </div>
            
            <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                <input 
                    type="number" 
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    min="1"
                    max="1000"
                />
            </div>
            
            {(version === 'v3' || version === 'v5') && (
                <>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Namespace</label>
                        <select 
                            value={namespaceMode} 
                            onChange={(e) => setNamespaceMode(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                        >
                            <option value="DNS">DNS</option>
                            <option value="URL">URL</option>
                            <option value="OID">OID</option>
                            <option value="X500">X.500</option>
                            <option value="Custom">Custom UUID</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name Input</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. example.com"
                        />
                    </div>
                    {namespaceMode === 'Custom' && (
                        <div className="col-span-full">
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Custom Namespace UUID</label>
                             <input 
                                type="text" 
                                value={customNamespace}
                                onChange={(e) => setCustomNamespace(e.target.value)}
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
                                placeholder="00000000-0000-0000-0000-000000000000"
                            />
                        </div>
                    )}
                </>
            )}
        </div>

        {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6 border-t border-slate-100 pt-4">
            <button 
                onClick={handleGenerate} 
                className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg hover:shadow-brand-200 flex items-center justify-center gap-2"
            >
                <Fingerprint className="w-5 h-5" /> Generate UUID{count > 1 ? 's' : ''}
            </button>
            <button 
                onClick={reset} 
                className="w-full sm:w-auto px-4 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition hover:text-slate-800 border border-slate-200 flex items-center justify-center"
                title="Reset"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>
      </div>

      {uuids.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Generated {uuids.length} UUID{uuids.length !== 1 ? 's' : ''} ({version})
                 </h3>
                 <div className="flex gap-2 w-full sm:w-auto">
                     <button 
                        onClick={handleCopy}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-600 transition"
                     >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                     </button>
                     <button 
                        onClick={handleDownload}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-600 transition"
                     >
                        <Download className="w-4 h-4" /> Download
                     </button>
                 </div>
             </div>

             {count === 1 ? (
                 <div className="bg-slate-900 text-green-400 font-mono text-xl md:text-2xl p-6 rounded-xl text-center break-all shadow-inner">
                    {uuids[0]}
                 </div>
             ) : (
                 <textarea 
                    readOnly
                    value={uuids.join('\n')}
                    className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-700 focus:outline-none resize-y"
                 />
             )}
          </div>
      )}
    </div>
  );
};

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState<number>(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    ambiguous: false,
  });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<'Weak' | 'Fair' | 'Good' | 'Strong'>('Weak');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score < 3) return 'Weak';
    if (score < 4) return 'Fair';
    if (score < 5) return 'Good';
    return 'Strong';
  };

  const generate = () => {
    setError('');
    const { uppercase, lowercase, numbers, symbols, ambiguous } = options;
    
    if (!uppercase && !lowercase && !numbers && !symbols) {
        setError('Please select at least one character type.');
        setPassword('');
        return;
    }

    let chars = '';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (ambiguous) {
        chars = chars.replace(/[Il1O0]/g, '');
    }

    if (chars.length === 0) {
        setError('No characters available with current settings.');
        return;
    }

    let pwd = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        pwd += chars[array[i] % chars.length];
    }
    
    setPassword(pwd);
    setStrength(calculateStrength(pwd));
  };

  useEffect(() => {
    generate();
  }, []);

  const handleCopy = () => {
      if (!password) return;
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
      if (!password) return;
      const blob = new Blob([password], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'secure-password.txt';
      a.click();
      URL.revokeObjectURL(url);
  };

  const reset = () => {
      setLength(16);
      setOptions({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        ambiguous: false,
      });
      setError('');
      setPassword('');
      setStrength('Weak');
  };

  const getStrengthColor = () => {
      switch (strength) {
          case 'Weak': return 'text-red-600 bg-red-50 border-red-100';
          case 'Fair': return 'text-orange-600 bg-orange-50 border-orange-100';
          case 'Good': return 'text-blue-600 bg-blue-50 border-blue-100';
          case 'Strong': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Generated Password</div>
            <div className="relative group">
                 <div className="text-3xl md:text-4xl font-mono font-bold text-slate-800 break-all py-4 min-h-[80px] flex items-center justify-center">
                    {password || <span className="text-slate-300 italic text-lg">Click Generate</span>}
                 </div>
                 
                 {password && (
                     <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${getStrengthColor()} mb-4 transition-colors`}>
                         <ShieldCheck className="w-3 h-3" />
                         {strength} Password
                     </div>
                 )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2">
                 <button 
                    onClick={handleCopy}
                    disabled={!password}
                    className="flex items-center justify-center gap-2 bg-brand-50 text-brand-700 hover:bg-brand-100 px-6 py-2 rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                 </button>
                 <button 
                    onClick={generate}
                    className="flex items-center justify-center gap-2 bg-brand-600 text-white hover:bg-brand-700 px-6 py-2 rounded-full font-medium transition shadow-lg hover:shadow-brand-200"
                 >
                    <RefreshCw className="w-4 h-4" /> Regenerate
                 </button>
                 <button 
                    onClick={handleDownload}
                    disabled={!password}
                    className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-full font-medium transition disabled:opacity-50"
                    title="Download as .txt"
                 >
                    <Download className="w-4 h-4" />
                 </button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-lg border-b border-slate-100 pb-4">
                <Settings className="w-5 h-5 text-brand-600" />
                Password Settings
            </div>

            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-slate-700">Password Length</label>
                        <span className="text-2xl font-bold text-brand-600 font-mono">{length}</span>
                    </div>
                    <input 
                        type="range" 
                        min="4" 
                        max="64" 
                        value={length} 
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full accent-brand-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                        <span>4</span>
                        <span>64</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                        <input 
                            type="checkbox" 
                            checked={options.uppercase} 
                            onChange={() => toggleOption('uppercase')}
                            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Uppercase (A-Z)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                        <input 
                            type="checkbox" 
                            checked={options.lowercase} 
                            onChange={() => toggleOption('lowercase')}
                            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Lowercase (a-z)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                        <input 
                            type="checkbox" 
                            checked={options.numbers} 
                            onChange={() => toggleOption('numbers')}
                            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                        <input 
                            type="checkbox" 
                            checked={options.symbols} 
                            onChange={() => toggleOption('symbols')}
                            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Symbols (!@#$)</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition sm:col-span-2 md:col-span-1">
                        <input 
                            type="checkbox" 
                            checked={options.ambiguous} 
                            onChange={() => toggleOption('ambiguous')}
                            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Avoid Ambiguous</span>
                    </label>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}
                
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button 
                        onClick={reset} 
                        className="text-sm text-slate-400 hover:text-slate-600 transition flex items-center gap-1"
                    >
                        <Trash2 className="w-4 h-4" /> Reset to Defaults
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export const LoremIpsum: React.FC = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const LOREM_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  useEffect(() => {
    setText(Array(paragraphs).fill(LOREM_TEXT).join('\n\n'));
  }, [paragraphs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-slate-700 mb-1">Paragraphs</label>
          <input 
            type="range" min="1" max="20" value={paragraphs} 
            onChange={(e) => setParagraphs(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="text-right text-xs text-slate-500">{paragraphs}</div>
        </div>
        <button onClick={handleCopy} className="w-full sm:w-auto bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700 transition flex items-center justify-center gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy
        </button>
      </div>
      <textarea 
        readOnly 
        value={text} 
        className="w-full h-96 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none text-slate-600 leading-relaxed"
      />
    </div>
  );
};

export const TextCaseConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    switch (type) {
      case 'upper': setOutput(input.toUpperCase()); break;
      case 'lower': setOutput(input.toLowerCase()); break;
      case 'title': setOutput(input.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')); break;
      case 'sentence': setOutput(input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())); break;
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="flex flex-col">
          <label className="text-sm font-bold text-slate-700 mb-2">Input</label>
          <textarea 
            value={input} onChange={(e) => setInput(e.target.value)} 
            className="flex-1 p-4 border border-slate-300 rounded-xl min-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Type or paste text..."
          />
      </div>
      <div className="flex flex-col">
          <label className="text-sm font-bold text-slate-700 mb-2">Output</label>
          <textarea 
            readOnly value={output} 
            className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl min-h-[200px] resize-none focus:outline-none"
            placeholder="Result will appear here..."
          />
      </div>
      <div className="md:col-span-2 flex flex-wrap gap-2 justify-center">
        <button onClick={() => convert('upper')} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-lg font-medium transition">UPPERCASE</button>
        <button onClick={() => convert('lower')} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-lg font-medium transition">lowercase</button>
        <button onClick={() => convert('title')} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-lg font-medium transition">Title Case</button>
        <button onClick={() => convert('sentence')} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-lg font-medium transition">Sentence case</button>
      </div>
    </div>
  );
};

export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const stats = {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    sentences: text.split(/[.!?]+/).filter(Boolean).length
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{stats.words}</div>
          <div className="text-xs text-blue-400 uppercase font-bold">Words</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="text-2xl font-bold text-green-600">{stats.chars}</div>
          <div className="text-xs text-green-400 uppercase font-bold">Chars</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <div className="text-2xl font-bold text-orange-600">{stats.sentences}</div>
          <div className="text-xs text-orange-400 uppercase font-bold">Sentences</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{stats.lines}</div>
          <div className="text-xs text-purple-400 uppercase font-bold">Lines</div>
        </div>
      </div>
      <textarea 
        value={text} onChange={(e) => setText(e.target.value)} 
        className="w-full h-80 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none text-slate-600 leading-relaxed"
        placeholder="Start typing or paste text to analyze..."
      />
    </div>
  );
};

export const RemoveLineBreaks: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const process = (mode: 'remove' | 'preserve-para') => {
        if(mode === 'remove') setOutput(input.replace(/(\r\n|\n|\r)/gm, " "));
        else setOutput(input.replace(/([^\n])\n(?=[^\n])/g, '$1 ')); // basic para preservation
    };

    return (
        <div className="space-y-4">
            <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full h-40 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Paste text here..."/>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button onClick={()=>process('remove')} className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition">Remove All Breaks</button>
                <button onClick={()=>process('preserve-para')} className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition">Preserve Paragraphs</button>
            </div>
            <textarea value={output} readOnly className="w-full h-40 p-4 bg-slate-50 border rounded-xl focus:outline-none" placeholder="Result..."/>
        </div>
    )
}

export const HashGenerator: React.FC<{type: string}> = ({type}) => {
    const [input, setInput] = useState('');
    const [hash, setHash] = useState('');

    useEffect(() => {
        const generate = async () => {
            if(!input) { setHash(''); return; }
            const msgBuffer = new TextEncoder().encode(input);
            const hashBuffer = await crypto.subtle.digest(type, msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setHash(hashHex);
        }
        generate();
    }, [input, type]);

    return (
        <div className="space-y-4">
            <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Text to hash..."/>
            <div className="p-4 bg-slate-100 rounded-xl break-all font-mono text-slate-700 text-sm">{hash || 'Hash will appear here'}</div>
        </div>
    )
}

export const MD5Generator: React.FC = () => {
    const [input, setInput] = useState('');
    const [hash, setHash] = useState('');
    
    useEffect(() => {
        if(!input) { setHash(''); return; }
        setHash(SparkMD5.hash(input));
    }, [input]);

    return (
        <div className="space-y-4">
            <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Text to MD5..."/>
            <div className="p-4 bg-slate-100 rounded-xl break-all font-mono text-slate-700 text-sm">{hash || 'MD5 will appear here'}</div>
        </div>
    )
}

export const RegexTester: React.FC = () => {
    const [regex, setRegex] = useState('');
    const [flags, setFlags] = useState('gm');
    const [text, setText] = useState('');
    const [matches, setMatches] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            setError('');
            if(!regex) { setMatches([]); return; }
            const re = new RegExp(regex, flags);
            const m = text.match(re);
            setMatches(m || []);
        } catch(e) {
            setError('Invalid Regex');
            setMatches([]);
        }
    }, [regex, flags, text]);

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input type="text" value={regex} onChange={e=>setRegex(e.target.value)} className="flex-1 p-3 border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Regular Expression"/>
                <input type="text" value={flags} onChange={e=>setFlags(e.target.value)} className="w-20 p-3 border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="flags"/>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-32 p-3 border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Test String"/>
            <div className="bg-slate-50 p-4 rounded-lg min-h-[100px]">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Matches ({matches.length})</div>
                <div className="flex flex-wrap gap-2">
                    {matches.map((m, i) => <span key={i} className="bg-yellow-200 px-2 py-1 rounded text-sm font-mono">{m}</span>)}
                </div>
            </div>
        </div>
    )
}

export const RandomWordGenerator: React.FC = () => {
    const [count, setCount] = useState(5);
    const [words, setWords] = useState<string[]>([]);
    
    const WORD_LIST = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "xylophone", "yellow", "zebra"];

    const generate = () => {
        const res = [];
        for(let i=0; i<count; i++) res.push(WORD_LIST[Math.floor(Math.random()*WORD_LIST.length)]);
        setWords(res);
    }

    return (
        <div className="space-y-6 text-center">
            <div className="flex justify-center items-center gap-4">
                <input type="number" min="1" max="50" value={count} onChange={e=>setCount(Number(e.target.value))} className="w-20 p-2 border rounded-lg text-center"/>
                <button onClick={generate} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 transition">Generate</button>
            </div>
            {words.length > 0 && (
                <div className="p-6 bg-slate-50 rounded-xl flex flex-wrap gap-3 justify-center">
                    {words.map((w,i)=><span key={i} className="bg-white px-3 py-1 rounded shadow-sm text-slate-700">{w}</span>)}
                </div>
            )}
        </div>
    )
}

export const StylishTextGenerator: React.FC = () => {
    const [input, setInput] = useState('ToolMaster');
    
    const STYLES: Record<string, (s:string)=>string> = {
        'Circled': (s) => s.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c.toUpperCase() === c ? 9333 : 9327))),
        'Squared': (s) => s.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c.toUpperCase() === c ? 127215 : 127151))),
        'Bold Serif': (s) => s.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c.toUpperCase() === c ? 119743 : 119737))),
    };

    return (
        <div className="space-y-6">
            <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="w-full p-4 text-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Type text..."/>
            <div className="grid gap-4">
                {Object.entries(STYLES).map(([name, transform]) => (
                    <div key={name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border hover:border-brand-300 transition group">
                        <div className="overflow-hidden mr-4">
                            <div className="text-xs text-slate-400 uppercase mb-1">{name}</div>
                            <div className="text-xl text-slate-800 truncate">{transform(input)}</div>
                        </div>
                        <button 
                            onClick={() => navigator.clipboard.writeText(transform(input))}
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-white p-2 rounded-lg shadow-sm text-slate-500 hover:text-brand-600 transition"
                        >
                            <Copy className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const CodeMinifier: React.FC<{lang: 'html'|'css'|'js'}> = ({lang}) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState<{orig: number, min: number, percent: number} | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    
    const [preserveComments, setPreserveComments] = useState(false);
    const [preserveLines, setPreserveLines] = useState(false);

    const handleMinify = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setError('');

        await new Promise(resolve => setTimeout(resolve, 50));

        try {
            let res = input;

            const processCSS = (css: string) => {
                let c = css;
                if (!preserveComments) {
                    c = c.replace(/\/\*[\s\S]*?\*\//g, "");
                }
                c = c.replace(/\s+/g, " ");
                c = c.replace(/\s*([{}:;,])\s*/g, "$1");
                c = c.replace(/;}/g, "}");
                return c.trim();
            };

            if (lang === 'css') {
                const openBraces = (res.match(/{/g) || []).length;
                const closeBraces = (res.match(/}/g) || []).length;
                if (openBraces !== closeBraces) {
                    setError(`Warning: Mismatched braces detected (Opening: ${openBraces}, Closing: ${closeBraces}). The minified code might be invalid.`);
                }
                res = processCSS(res);
            } else if (lang === 'html') {
                if (!preserveComments) {
                    res = res.replace(/<!--[\s\S]*?-->/g, "");
                }
                
                if (preserveLines) {
                     res = res.split('\n').map(l => l.trim()).filter(l => l).join('\n');
                } else {
                     res = res.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (_, start, css, end) => start + processCSS(css) + end);
                     res = res.replace(/[\r\n\t]+/g, ' ');
                     res = res.replace(/\s+/g, " ");
                     res = res.replace(/>\s+</g, "><");
                }
            } else if (lang === 'js') {
                 try {
                     // @ts-ignore
                     const { minify } = await import('terser');
                     const options = {
                         mangle: true,
                         compress: true,
                         format: {
                             comments: preserveComments ? 'all' as const : false
                         }
                     };
                     
                     const result = await minify(input, options);
                     if (result.code) {
                         res = result.code;
                     } else {
                         throw new Error("Minification resulted in empty output.");
                     }
                 } catch (e) {
                     // Fallback for basic JS minification if terser fails to load in browser
                     res = res.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ""); // remove comments
                     res = res.replace(/\s+/g, " "); // collapse whitespace
                     res = res.replace(/\s*([=+\-*/{}();,])\s*/g, "$1"); // remove space around operators
                 }
            }
            
            res = res.trim();
            
            setOutput(res);
            setStats({
                orig: input.length,
                min: res.length,
                percent: input.length > 0 ? Math.round((1 - res.length / input.length) * 100) : 0
            });
        } catch (err: any) {
            console.error(err);
            const msg = err.message ? err.message.replace(/\n/g, ' ') : "Syntax Error or Minification failed.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `minified.${lang}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const reset = () => {
        setInput('');
        setOutput('');
        setStats(null);
        setError('');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                            <FileCode className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{lang.toUpperCase()} Minifier</h2>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={preserveComments} 
                                onChange={(e) => setPreserveComments(e.target.checked)}
                                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                            />
                            Preserve Comments
                        </label>
                        {lang === 'html' && (
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={preserveLines} 
                                    onChange={(e) => setPreserveLines(e.target.checked)}
                                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                                />
                                Preserve Line Breaks
                            </label>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-100">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[500px]">
                     {/* Input */}
                     <div className="flex flex-col h-[300px] lg:h-full">
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Input Code</label>
                            <span className="text-xs text-slate-400">{input.length} chars</span>
                        </div>
                        <textarea 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            className="flex-1 p-4 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" 
                            placeholder={`Paste your ${lang.toUpperCase()} code here...`}
                        />
                     </div>

                     {/* Output */}
                     <div className="flex flex-col h-[300px] lg:h-full">
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Minified Output</label>
                            <div className="flex gap-4 text-xs">
                                {stats && (
                                    <>
                                        <span className="text-slate-600">{stats.min} chars</span>
                                        <span className="text-green-600 font-bold">-{stats.percent}% saved</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <textarea 
                            readOnly 
                            value={output} 
                            className="flex-1 p-4 border border-slate-200 bg-slate-50 rounded-xl font-mono text-xs focus:outline-none resize-none text-slate-700" 
                            placeholder="Minified code will appear here..."
                        />
                     </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button 
                        onClick={handleMinify} 
                        disabled={!input || loading}
                        className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg hover:shadow-brand-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                        {loading ? 'Minifying...' : 'Minify Code'}
                    </button>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            onClick={handleCopy}
                            disabled={!output}
                            className="flex-1 md:flex-none px-6 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition border border-slate-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button 
                            onClick={handleDownload}
                            disabled={!output}
                            className="flex-1 md:flex-none px-6 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition border border-slate-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={reset}
                            className="px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition border border-slate-200"
                            title="Clear"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const CodeBeautifier: React.FC<{lang: 'html'|'css'|'js'}> = ({lang}) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState<{orig: number, beaut: number} | null>(null);
    
    // Options
    const [indentSize, setIndentSize] = useState(4);
    const [preserveNewlines, setPreserveNewlines] = useState(true);
    const [indentWithTabs, setIndentWithTabs] = useState(false);
    const [preserveComments, setPreserveComments] = useState(true);
    const [preserveInline, setPreserveInline] = useState(true); // HTML specific

    const handleBeautify = async () => {
        if (!input.trim()) {
            setError('Please enter some code to beautify.');
            return;
        }
        setLoading(true);
        setError('');

        await new Promise(resolve => setTimeout(resolve, 50));

        try {
            let codeToFormat = input;

            if (!preserveComments) {
                 if (lang === 'css') {
                     codeToFormat = codeToFormat.replace(/\/\*[\s\S]*?\*\//g, "");
                 } else if (lang === 'html') {
                     codeToFormat = codeToFormat.replace(/<!--[\s\S]*?-->/g, "");
                 } else if (lang === 'js') {
                     codeToFormat = codeToFormat.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
                 }
            }

            let res = '';
            const opts = {
                indent_size: indentWithTabs ? 1 : indentSize,
                indent_char: indentWithTabs ? '\t' : ' ',
                max_preserve_newlines: preserveNewlines ? 2 : 0,
                preserve_newlines: preserveNewlines,
                indent_scripts: 'normal' as const,
                end_with_newline: true,
                selector_separator_newline: true,
                newline_between_rules: true,
                inline: preserveInline ? undefined : []
            };

            if (lang === 'html' && html_beautify) {
                res = html_beautify(codeToFormat, opts);
            } else if (lang === 'css' && css_beautify) {
                res = css_beautify(codeToFormat, opts);
            } else if (lang === 'js' && js_beautify) {
                res = js_beautify(codeToFormat, opts);
            } else {
                throw new Error("Beautifier library not loaded properly.");
            }

            setOutput(res);
            setStats({ orig: input.length, beaut: res.length });
        } catch (err: any) {
            console.error(err);
            setError('Error beautifying code. Please check input validity.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `beautified.${lang}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const reset = () => {
        setInput('');
        setOutput('');
        setError('');
        setStats(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                            <Code className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{lang.toUpperCase()} Beautifier</h2>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-1 rounded-lg border border-slate-200">
                            <AlignLeft className="w-4 h-4 ml-2 text-slate-400" />
                            <select 
                                value={indentWithTabs ? 'tab' : indentSize}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (v === 'tab') {
                                        setIndentWithTabs(true);
                                    } else {
                                        setIndentWithTabs(false);
                                        setIndentSize(parseInt(v));
                                    }
                                }}
                                className="bg-transparent border-none text-slate-700 text-xs font-medium focus:ring-0 cursor-pointer p-0"
                            >
                                <option value="2">2 Spaces</option>
                                <option value="4">4 Spaces</option>
                                <option value="8">8 Spaces</option>
                                <option value="tab">Tabs</option>
                            </select>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                checked={preserveNewlines} 
                                onChange={(e) => setPreserveNewlines(e.target.checked)}
                                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                            />
                            Preserve Newlines
                        </label>
                        
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                checked={preserveComments} 
                                onChange={(e) => setPreserveComments(e.target.checked)}
                                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                            />
                            Preserve Comments
                        </label>

                        {lang === 'html' && (
                             <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none" title="Keep inline elements like <span> or <a> on the same line">
                                <input 
                                    type="checkbox" 
                                    checked={preserveInline} 
                                    onChange={(e) => setPreserveInline(e.target.checked)}
                                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                                />
                                Preserve Inline Tags
                            </label>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-100">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[500px]">
                     {/* Input */}
                     <div className="flex flex-col h-[300px] lg:h-full">
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Input Code</label>
                            <span className="text-xs text-slate-400">{input.length} chars</span>
                        </div>
                        <textarea 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            className="flex-1 p-4 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" 
                            placeholder={`Paste your ${lang.toUpperCase()} code here...`}
                        />
                     </div>

                     {/* Output */}
                     <div className="flex flex-col h-[300px] lg:h-full">
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Beautified Output</label>
                            <div className="flex gap-4 text-xs">
                                {stats && (
                                    <>
                                        <span className="text-slate-600">{stats.beaut} chars</span>
                                        <span className={`font-bold ${stats.beaut > stats.orig ? 'text-orange-600' : 'text-green-600'}`}>
                                            {stats.beaut > stats.orig ? '+' : ''}{Math.round(((stats.beaut - stats.orig) / stats.orig) * 100)}% size
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <textarea 
                            readOnly 
                            value={output} 
                            className="flex-1 p-4 border border-slate-200 bg-slate-50 rounded-xl font-mono text-xs focus:outline-none resize-none text-slate-700" 
                            placeholder="Formatted code will appear here..."
                        />
                     </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button 
                        onClick={handleBeautify} 
                        disabled={!input || loading}
                        className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg hover:shadow-brand-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Code className="w-5 h-5" />}
                        {loading ? 'Formatting...' : 'Beautify Code'}
                    </button>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            onClick={handleCopy}
                            disabled={!output}
                            className="flex-1 md:flex-none px-6 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition border border-slate-200 font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button 
                            onClick={handleDownload}
                            disabled={!output}
                            className="flex-1 md:flex-none px-6 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition border border-slate-200 font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={reset}
                            className="px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition border border-slate-200"
                            title="Clear"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<number | 'tab'>(2);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState<string>('data.json');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setInput(ev.target.result as string);
          setError(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const processJson = (mode: 'format' | 'minify') => {
    if (!input.trim()) {
        setError('Please enter JSON to process');
        return;
    }
    try {
      const parsed = JSON.parse(input);
      let res = '';
      if (mode === 'minify') {
        res = JSON.stringify(parsed);
      } else {
        res = JSON.stringify(parsed, null, indent === 'tab' ? '\t' : indent);
      }
      setOutput(res);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.startsWith('formatted-') ? fileName : `formatted-${fileName}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setFileName('data.json');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Calculate size stats
  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
       <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                      <FileJson className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">JSON Formatter & Validator</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end">
                  {/* File Upload */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 font-medium transition"
                  >
                    <Upload className="w-4 h-4" /> Upload File
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json,application/json" />

                  {/* Indent Select */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg border border-slate-200">
                      <Settings className="w-4 h-4 text-slate-500" />
                      <select 
                        value={indent} 
                        onChange={(e) => setIndent(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
                        className="bg-transparent border-none text-sm text-slate-700 font-medium focus:ring-0 cursor-pointer p-0"
                      >
                          <option value={2}>2 Spaces</option>
                          <option value={4}>4 Spaces</option>
                          <option value={8}>8 Spaces</option>
                          <option value="tab">Tabs</option>
                      </select>
                  </div>
              </div>
          </div>

          {/* Error Display */}
          {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-100 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-medium font-mono">{error}</span>
              </div>
          )}

          {/* Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[600px]">
              {/* Input */}
              <div className="flex flex-col h-[300px] lg:h-full">
                  <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Input JSON</label>
                      <span className="text-xs text-slate-400">{inputSize > 0 ? `${(inputSize/1024).toFixed(2)} KB` : '0 KB'}</span>
                  </div>
                  <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 p-4 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none text-slate-700"
                      placeholder='Paste your JSON here...'
                      spellCheck={false}
                  />
              </div>

              {/* Output */}
              <div className="flex flex-col h-[300px] lg:h-full">
                  <div className="flex justify-between mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Formatted Output</label>
                      <span className="text-xs text-slate-400">{outputSize > 0 ? `${(outputSize/1024).toFixed(2)} KB` : '0 KB'}</span>
                  </div>
                  <textarea 
                      readOnly
                      value={output}
                      className="flex-1 p-4 border border-slate-200 bg-slate-50 rounded-xl font-mono text-xs focus:outline-none resize-none text-slate-700"
                      placeholder='Processed JSON will appear here...'
                      spellCheck={false}
                  />
              </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-100">
              <button 
                  onClick={() => processJson('format')} 
                  className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg hover:shadow-brand-200 flex items-center justify-center gap-2"
              >
                  <AlignLeft className="w-5 h-5" /> Format / Beautify
              </button>
              <button 
                  onClick={() => processJson('minify')} 
                  className="flex-1 md:flex-none px-6 bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-900 transition shadow-md font-medium flex items-center justify-center gap-2"
              >
                  <Minimize2 className="w-5 h-5" /> Minify
              </button>
              
              <div className="w-px h-10 bg-slate-200 mx-2 hidden md:block"></div>

              <div className="flex gap-2 w-full md:w-auto">
                  <button 
                      onClick={handleCopy}
                      disabled={!output}
                      className="flex-1 md:flex-none px-6 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition border border-slate-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button 
                      onClick={handleDownload}
                      disabled={!output}
                      className="flex-1 md:flex-none px-6 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition border border-slate-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                      <Download className="w-4 h-4" />
                  </button>
                  <button 
                      onClick={handleClear}
                      className="px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition border border-slate-200"
                      title="Clear All"
                  >
                      <Trash2 className="w-5 h-5" />
                  </button>
              </div>
          </div>
       </div>
    </div>
  );
};

export const UrlEncoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setError('');
    if (!input) {
        setOutput('');
        return;
    }
    try {
        if (mode === 'encode') {
            setOutput(encodeURIComponent(input));
        } else {
            setOutput(decodeURIComponent(input));
        }
    } catch (e) {
        setError('Invalid URL encoded text detected.');
        setOutput('');
    }
  }, [input, mode]);

  const handleCopy = () => {
      if (!output) return;
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                 <label className="text-sm font-bold text-slate-700">Input Text</label>
                 <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-medium">
                     <button onClick={()=>setMode('encode')} className={`px-3 py-1 rounded ${mode === 'encode' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500'}`}>Encode</button>
                     <button onClick={()=>setMode('decode')} className={`px-3 py-1 rounded ${mode === 'decode' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500'}`}>Decode</button>
                 </div>
             </div>
             <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none text-sm"
                placeholder="Enter text to process..."
             />
        </div>
        
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                 <label className="text-sm font-bold text-slate-700">Result</label>
                 <button onClick={handleCopy} className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">
                     {copied ? <Check className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} {copied ? 'Copied' : 'Copy'}
                 </button>
             </div>
             <textarea 
                readOnly
                value={output}
                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none resize-none text-sm"
                placeholder="Result will appear here..."
             />
             {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
    </div>
  );
};
