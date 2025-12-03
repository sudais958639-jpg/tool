
import React, { useState, useRef, useEffect } from 'react';
import { performOCR } from '../services/gemini';
import { 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Copy, 
  Video, 
  Search,
  Globe,
  ShieldCheck,
  Keyboard,
  Palette,
  ExternalLink,
  Crop
} from 'lucide-react';

// --- IMAGE COMPRESSOR ---
export const ImageCompressor: React.FC = () => {
    const [img, setImg] = useState<string | null>(null);
    const [compressed, setCompressed] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [originalSize, setOriginalSize] = useState<string>('');
    const [compressedSize, setCompressedSize] = useState<string>('');

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            setFileName(file.name);
            setOriginalSize(formatSize(file.size));
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImg(ev.target?.result as string);
                
                const imgObj = new Image();
                imgObj.src = ev.target?.result as string;
                imgObj.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = imgObj.width;
                    canvas.height = imgObj.height;
                    const ctx = canvas.getContext('2d');
                    if(ctx) {
                        ctx.drawImage(imgObj, 0, 0);
                        const type = file.type || 'image/jpeg';
                        const quality = 0.6;
                        const compressedDataUrl = canvas.toDataURL(type, quality);
                        setCompressed(compressedDataUrl);

                        const head = `data:${type};base64,`;
                        const size = Math.round((compressedDataUrl.length - head.length) * 3 / 4);
                        setCompressedSize(formatSize(size));
                    }
                }
            }
            reader.readAsDataURL(file);
        }
    }

    const downloadImage = () => {
        if (compressed && fileName) {
            const link = document.createElement('a');
            link.href = compressed;
            const lastDotIndex = fileName.lastIndexOf('.');
            const name = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
            const ext = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : 'jpg';
            link.download = `${name}-compressed.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    return (
        <div className="space-y-6">
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors group">
                <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                <div className="flex flex-col items-center pointer-events-none">
                    <div className="p-4 bg-brand-50 text-brand-500 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8"/>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Click or Drag to Upload Image</p>
                    <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP</p>
                </div>
            </div>

            {img && compressed && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-baseline mb-2">
                            <p className="font-bold text-slate-700 text-sm">Original</p>
                            <span className="text-xs text-slate-500 font-mono bg-white px-2 py-1 rounded border">{originalSize}</span>
                        </div>
                        <img src={img} className="w-full rounded border border-slate-200 shadow-sm" alt="Original"/>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="flex justify-between items-baseline mb-2">
                            <p className="font-bold text-green-700 text-sm">Compressed (~60%)</p>
                            <span className="text-xs text-green-700 font-mono font-bold bg-white px-2 py-1 rounded border border-green-200">{compressedSize}</span>
                        </div>
                        <img src={compressed} className="w-full rounded border border-green-200 shadow-sm" alt="Compressed"/>
                        <button 
                            onClick={downloadImage}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 transition font-medium shadow-sm active:scale-[0.98]"
                        >
                            <Download className="w-4 h-4" /> Download
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- IMAGE RESIZER ---
export const ImageResizer: React.FC = () => {
    const [imgData, setImgData] = useState<string | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [ratio, setRatio] = useState(0);
    const [keepRatio, setKeepRatio] = useState(true);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if(!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const res = ev.target?.result as string;
            setImgData(res);
            const i = new Image();
            i.onload = () => {
                setWidth(i.width);
                setHeight(i.height);
                setRatio(i.width/i.height);
            };
            i.src = res;
        };
        reader.readAsDataURL(f);
    };

    const handleW = (v: number) => {
        setWidth(v);
        if(keepRatio && ratio) setHeight(Math.round(v / ratio));
    };

    const handleH = (v: number) => {
        setHeight(v);
        if(keepRatio && ratio) setWidth(Math.round(v * ratio));
    };

    const download = () => {
        if(!imgData) return;
        const cvs = document.createElement('canvas');
        cvs.width = width;
        cvs.height = height;
        const ctx = cvs.getContext('2d');
        const i = new Image();
        i.onload = () => {
            ctx?.drawImage(i, 0, 0, width, height);
            const link = document.createElement('a');
            link.download = 'resized-image.png';
            link.href = cvs.toDataURL();
            link.click();
        };
        i.src = imgData;
    };

    return (
        <div className="space-y-6">
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors group">
                <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                <div className="flex flex-col items-center pointer-events-none">
                    <div className="p-4 bg-brand-50 text-brand-500 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Crop className="w-8 h-8"/>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Upload Image to Resize</p>
                </div>
            </div>

            {imgData && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Width (px)</label>
                            <input type="number" value={width} onChange={e=>handleW(Number(e.target.value))} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"/>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Height (px)</label>
                            <input type="number" value={height} onChange={e=>handleH(Number(e.target.value))} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"/>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700">
                            <input type="checkbox" checked={keepRatio} onChange={e=>setKeepRatio(e.target.checked)} className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"/>
                            Lock Aspect Ratio
                        </label>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-center overflow-hidden mb-6">
                        <img src={imgData} style={{ width: '100%', maxWidth: '300px', height: 'auto' }} alt="Preview" />
                    </div>
                    <button onClick={download} className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg flex items-center justify-center gap-2">
                        <Download className="w-5 h-5"/> Download Resized Image
                    </button>
                </div>
            )}
        </div>
    );
};

// --- OCR TOOL ---
export const OCRTool: React.FC = () => {
    const [img, setImg] = useState<string | null>(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if(!f) return;
        const r = new FileReader();
        r.onload = ev => setImg(ev.target?.result as string);
        r.readAsDataURL(f);
    };

    const scan = async () => {
        if(!img) return;
        setLoading(true);
        const res = await performOCR(img);
        setText(res);
        setLoading(false);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                 <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                    <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                    <div className="flex flex-col items-center pointer-events-none">
                        <ImageIcon className="w-8 h-8 text-slate-400 mb-2"/>
                        <p className="text-sm font-medium text-slate-600">Upload Image for OCR</p>
                    </div>
                </div>
                {img && (
                    <div className="space-y-4">
                        <img src={img} className="w-full rounded-lg border border-slate-200 max-h-64 object-contain bg-slate-50"/>
                        <button onClick={scan} disabled={loading} className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition disabled:opacity-50">
                            {loading ? 'Scanning...' : 'Extract Text'}
                        </button>
                    </div>
                )}
            </div>
            <div className="flex flex-col h-full min-h-[300px]">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Extracted Text</label>
                    <button onClick={() => navigator.clipboard.writeText(text)} disabled={!text} className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 disabled:opacity-50">
                        <Copy className="w-3 h-3"/> Copy
                    </button>
                </div>
                <textarea 
                    value={text} 
                    readOnly 
                    className="flex-1 w-full p-4 border border-slate-300 rounded-xl focus:outline-none resize-none bg-slate-50 text-sm leading-relaxed"
                    placeholder="Text will appear here after scanning..."
                />
            </div>
        </div>
    );
};

// --- YOUTUBE THUMBNAIL ---
export const YouTubeThumbnail: React.FC = () => {
    const [url, setUrl] = useState('');
    const [id, setId] = useState<string | null>(null);

    const extract = () => {
        const m = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/);
        setId(m ? m[1] : null);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Video className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                    <input 
                        value={url} 
                        onChange={e=>setUrl(e.target.value)} 
                        className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                        placeholder="Paste YouTube URL here..."
                    />
                </div>
                <button onClick={extract} className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-md w-full sm:w-auto">
                    Get Thumbnails
                </button>
            </div>

            {id && (
                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                        <img src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`} className="w-full rounded-lg shadow-sm mb-3" alt="HD"/>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700 text-sm">Max Resolution (HD)</span>
                            <a href={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`} download target="_blank" rel="noreferrer" className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded text-slate-700 font-medium">Download</a>
                        </div>
                    </div>
                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                        <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} className="w-full rounded-lg shadow-sm mb-3" alt="HQ"/>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700 text-sm">High Quality</span>
                            <a href={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} download target="_blank" rel="noreferrer" className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded text-slate-700 font-medium">Download</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COLOR PICKER ---
export const ColorPicker: React.FC = () => {
    const [color, setColor] = useState('#0ea5e9');
    const [rgb, setRgb] = useState('rgb(14, 165, 233)');

    useEffect(() => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        setRgb(`rgb(${r}, ${g}, ${b})`);
    }, [color]);

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                 <input 
                    type="color" 
                    value={color} 
                    onChange={e => setColor(e.target.value)} 
                    className="w-48 h-48 cursor-pointer bg-transparent border-none" 
                />
                <p className="text-slate-500 text-sm mt-4">Click circle to pick color</p>
             </div>
             <div className="space-y-4">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">HEX Code</label>
                     <div className="flex gap-2">
                         <input value={color} readOnly className="flex-1 p-3 border border-slate-300 rounded-lg font-mono text-lg uppercase"/>
                         <button onClick={() => navigator.clipboard.writeText(color)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600">
                             <Copy className="w-5 h-5"/>
                         </button>
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">RGB Code</label>
                     <div className="flex gap-2">
                         <input value={rgb} readOnly className="flex-1 p-3 border border-slate-300 rounded-lg font-mono text-lg"/>
                         <button onClick={() => navigator.clipboard.writeText(rgb)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600">
                             <Copy className="w-5 h-5"/>
                         </button>
                     </div>
                 </div>
             </div>
        </div>
    );
};

// --- WHOIS LOOKUP ---
export const WhoisLookup: React.FC = () => {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const lookup = async () => {
        if(!domain) return;
        setLoading(true);
        setData(null);
        try {
            // Using a free RDAP API (ICANN standard)
            const res = await fetch(`https://rdap.org/domain/${domain}`);
            if(!res.ok) throw new Error('Not found');
            const json = await res.json();
            setData(json);
        } catch(e) {
            setData({ error: 'Domain not found or registry does not support public RDAP.' });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
                <input 
                    value={domain} 
                    onChange={e => setDomain(e.target.value)} 
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                    placeholder="example.com"
                    onKeyDown={e => e.key === 'Enter' && lookup()}
                />
                <button onClick={lookup} disabled={loading} className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition disabled:opacity-50">
                    {loading ? 'Searching...' : 'Whois Lookup'}
                </button>
            </div>

            {data && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {data.error ? (
                        <div className="text-red-500 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {data.error}</div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Domain Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><span className="font-bold text-slate-500">Handle:</span> {data.handle}</div>
                                <div><span className="font-bold text-slate-500">Status:</span> {data.status?.join(', ')}</div>
                                <div><span className="font-bold text-slate-500">Port 43:</span> {data.port43}</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
                                {JSON.stringify(data, null, 2)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- SSL CHECKER ---
export const SSLChecker: React.FC = () => {
    const [domain, setDomain] = useState('');
    
    return (
        <div className="max-w-2xl mx-auto space-y-6 text-center">
            <ShieldCheck className="w-16 h-16 text-green-500 mx-auto opacity-80" />
            <h2 className="text-2xl font-bold text-slate-800">Check SSL Security</h2>
            <p className="text-slate-500">Verify if a website has a valid SSL certificate and check its security rating.</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
                <input 
                    value={domain} 
                    onChange={e => setDomain(e.target.value)} 
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                    placeholder="example.com"
                />
                <a 
                    href={`https://www.ssllabs.com/ssltest/analyze.html?d=${domain}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition flex items-center justify-center gap-2 ${!domain ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    Check SSL <ExternalLink className="w-4 h-4" />
                </a>
            </div>
            <p className="text-xs text-slate-400">Powered by Qualys SSL Labs</p>
        </div>
    );
};

// --- TYPING TEST ---
export const TypingTest: React.FC = () => {
    const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. Clean code reads like well-written prose.";
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [finished, setFinished] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (!startTime) setStartTime(Date.now());
        setInput(val);

        if (val === SAMPLE_TEXT) {
            setFinished(true);
            const timeMin = (Date.now() - (startTime || Date.now())) / 60000;
            const wordCount = SAMPLE_TEXT.split(' ').length;
            setWpm(Math.round(wordCount / timeMin));
        }
    };

    const reset = () => {
        setInput('');
        setStartTime(null);
        setWpm(0);
        setFinished(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-lg leading-relaxed font-medium text-slate-700 select-none">
                {SAMPLE_TEXT}
            </div>
            
            <textarea 
                value={input}
                onChange={handleChange}
                disabled={finished}
                className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-lg resize-none"
                placeholder="Start typing the text above..."
            />
            
            <div className="flex items-center justify-between">
                <button onClick={reset} className="flex items-center gap-2 text-slate-600 hover:text-brand-600 font-medium transition">
                    <RefreshCw className="w-5 h-5"/> Reset Test
                </button>
                {finished && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold animate-in zoom-in">
                        <Check className="w-5 h-5"/> Result: {wpm} WPM
                    </div>
                )}
            </div>
        </div>
    );
};

// --- FAVICON GENERATOR ---
export const FaviconGenerator: React.FC = () => {
    const [img, setImg] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if(f) {
            const r = new FileReader();
            r.onload = ev => setImg(ev.target?.result as string);
            r.readAsDataURL(f);
        }
    };

    const downloadFavicon = () => {
        const cvs = canvasRef.current;
        if(cvs) {
            const link = document.createElement('a');
            link.download = 'favicon.ico';
            link.href = cvs.toDataURL('image/x-icon');
            link.click();
        }
    };

    useEffect(() => {
        if(img && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const i = new Image();
            i.onload = () => {
                if(ctx) {
                    ctx.clearRect(0,0,32,32);
                    ctx.drawImage(i, 0, 0, 32, 32);
                }
            };
            i.src = img;
        }
    }, [img]);

    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="space-y-6">
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                    <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                    <div className="flex flex-col items-center pointer-events-none">
                        <Upload className="w-8 h-8 text-brand-400 mb-2"/>
                        <p className="text-sm font-medium text-slate-600">Upload Image</p>
                    </div>
                </div>
                <div className="text-sm text-slate-500">
                    <p>Recommended: Square image (500x500px)</p>
                </div>
             </div>
             
             <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                 <h3 className="font-bold text-slate-700 mb-4">Preview (32x32)</h3>
                 <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
                     <canvas ref={canvasRef} width={32} height={32} className="w-8 h-8"/>
                 </div>
                 <button 
                    onClick={downloadFavicon} 
                    disabled={!img}
                    className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 transition shadow-sm disabled:opacity-50"
                >
                     Download .ico
                 </button>
             </div>
        </div>
    );
};
