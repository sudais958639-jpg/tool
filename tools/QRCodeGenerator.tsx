import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://toolmasterpro.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = 'qrcode.png';
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <div className="flex-1 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content (URL or Text)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            placeholder="Enter text to encode..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Foreground Color</label>
             <div className="flex items-center gap-2">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-10 rounded cursor-pointer" />
                <span className="text-xs text-slate-500 font-mono">{fgColor}</span>
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Background Color</label>
             <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-10 rounded cursor-pointer" />
                <span className="text-xs text-slate-500 font-mono">{bgColor}</span>
             </div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300">
        <div className="bg-white p-4 shadow-lg rounded-lg mb-6">
           <QRCodeCanvas
             id="qr-code-canvas"
             value={text}
             size={size}
             fgColor={fgColor}
             bgColor={bgColor}
             level={"H"}
             includeMargin={true}
           />
        </div>
        <button onClick={downloadQR} className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition font-medium">
          <Download className="w-5 h-5" /> Download PNG
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;