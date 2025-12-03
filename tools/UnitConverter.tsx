import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<'length' | 'weight'>('length');
  const [inputVal, setInputVal] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [result, setResult] = useState<number>(0);

  const units = {
    length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, mi: 1609.34 },
    weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 }
  };

  useEffect(() => {
    const rate = units[category][fromUnit as keyof typeof units.length] / units[category][toUnit as keyof typeof units.length];
    setResult(inputVal * rate);
  }, [inputVal, fromUnit, toUnit, category]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <div className="flex gap-4 mb-6 justify-center">
        <button 
          onClick={() => { setCategory('length'); setFromUnit('m'); setToUnit('ft'); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === 'length' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Length
        </button>
        <button 
          onClick={() => { setCategory('weight'); setFromUnit('kg'); setToUnit('lb'); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === 'weight' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Weight
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
           <input 
             type="number" 
             value={inputVal} 
             onChange={(e) => setInputVal(parseFloat(e.target.value) || 0)}
             className="w-full p-3 border border-slate-300 rounded-lg text-lg font-semibold text-center focus:ring-2 focus:ring-brand-500"
           />
           <select 
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600"
           >
             {Object.keys(units[category]).map(u => <option key={u} value={u}>{u}</option>)}
           </select>
        </div>

        <ArrowRightLeft className="text-slate-400 w-6 h-6 rotate-90 md:rotate-0" />

        <div className="flex-1 w-full">
           <div className="w-full p-3 bg-slate-100 border border-transparent rounded-lg text-lg font-semibold text-center text-slate-800">
             {Number.isInteger(result) ? result : result.toFixed(4)}
           </div>
           <select 
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600"
           >
             {Object.keys(units[category]).map(u => <option key={u} value={u}>{u}</option>)}
           </select>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;