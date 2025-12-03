import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InvestmentCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [contribution, setContribution] = useState(500);

  const data = useMemo(() => {
    const result = [];
    let currentBalance = principal;
    let totalContributed = principal;

    for (let i = 0; i <= years; i++) {
      result.push({
        year: i,
        balance: Math.round(currentBalance),
        invested: totalContributed
      });

      // Compound logic (Annual)
      const interest = currentBalance * (rate / 100);
      currentBalance += interest + (contribution * 12);
      totalContributed += (contribution * 12);
    }
    return result;
  }, [principal, rate, years, contribution]);

  const finalBalance = data[data.length - 1].balance;
  const totalInvested = data[data.length - 1].invested;
  const totalInterest = finalBalance - totalInvested;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Inputs */}
      <div className="md:col-span-1 space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Parameters</h2>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Initial Investment ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Contribution ($)</label>
          <input
            type="number"
            value={contribution}
            onChange={(e) => setContribution(Number(e.target.value))}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Annual Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            step="0.1"
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Time Period (Years)</label>
          <input
            type="range"
            min="1"
            max="50"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="text-right text-sm text-slate-500">{years} Years</div>
        </div>
      </div>

      {/* Results */}
      <div className="md:col-span-2 space-y-6">
        <div className="grid grid-cols-3 gap-4">
           <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-brand-500">
             <p className="text-xs text-slate-500 uppercase">Total Balance</p>
             <p className="text-2xl font-bold text-brand-900">${finalBalance.toLocaleString()}</p>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
             <p className="text-xs text-slate-500 uppercase">Total Interest</p>
             <p className="text-2xl font-bold text-emerald-700">${totalInterest.toLocaleString()}</p>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-slate-400">
             <p className="text-xs text-slate-500 uppercase">Total Invested</p>
             <p className="text-2xl font-bold text-slate-700">${totalInvested.toLocaleString()}</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4">Growth Chart</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="balance" name="Total Value" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="invested" name="Principal" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;