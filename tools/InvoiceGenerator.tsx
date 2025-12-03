
import React, { useState } from 'react';
import { Plus, Trash2, Printer, Upload, X, Download } from 'lucide-react';

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP - British Pound' },
  { code: 'INR', symbol: '₹', label: 'INR - Indian Rupee' },
  { code: 'PKR', symbol: '₨', label: 'PKR - Pakistani Rupee' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD - Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD - Australian Dollar' },
  { code: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen' },
  { code: 'CNY', symbol: 'CN¥', label: 'CNY - Chinese Yuan' },
  { code: 'AED', symbol: 'AED', label: 'AED - UAE Dirham' },
  { code: 'SAR', symbol: 'SAR', label: 'SAR - Saudi Riyal' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF - Swiss Franc' },
  { code: 'ZAR', symbol: 'R', label: 'ZAR - South African Rand' },
  { code: 'BRL', symbol: 'R$', label: 'BRL - Brazilian Real' },
  { code: 'RUB', symbol: '₽', label: 'RUB - Russian Ruble' },
  { code: 'SGD', symbol: 'S$', label: 'SGD - Singapore Dollar' },
  { code: 'NZD', symbol: 'NZ$', label: 'NZD - New Zealand Dollar' },
  { code: 'MXN', symbol: 'MX$', label: 'MXN - Mexican Peso' },
  { code: 'HKD', symbol: 'HK$', label: 'HKD - Hong Kong Dollar' },
  { code: 'SEK', symbol: 'kr', label: 'SEK - Swedish Krona' },
  { code: 'NOK', symbol: 'kr', label: 'NOK - Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', label: 'DKK - Danish Krone' },
  { code: 'TRY', symbol: '₺', label: 'TRY - Turkish Lira' },
  { code: 'IDR', symbol: 'Rp', label: 'IDR - Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', label: 'MYR - Malaysian Ringgit' },
  { code: 'PHP', symbol: '₱', label: 'PHP - Philippine Peso' },
  { code: 'THB', symbol: '฿', label: 'THB - Thai Baht' },
  { code: 'VND', symbol: '₫', label: 'VND - Vietnamese Dong' },
  { code: 'KRW', symbol: '₩', label: 'KRW - South Korean Won' },
  { code: 'PLN', symbol: 'zł', label: 'PLN - Polish Zloty' },
];

const InvoiceGenerator: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [from, setFrom] = useState('Your Company Name\n123 Business Rd\nCity, Country');
  const [to, setTo] = useState('Client Company\n456 Client St\nCity, Country');
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: 'Web Development Services', quantity: 1, price: 1000 },
  ]);
  const [taxRate, setTaxRate] = useState(10);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [logo, setLogo] = useState<string | null>(null);

  // Derive symbol from code
  const currency = CURRENCIES.find(c => c.code === currencyCode)?.symbol || '$';

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-preview');
    const opt = {
      margin: 10,
      filename: `Invoice-${invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // @ts-ignore
    if (window.html2pdf) {
        // @ts-ignore
        window.html2pdf().set(opt).from(element).save();
    } else {
        alert('PDF generator library is loading, please try again in a moment.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-full md:w-auto">
            <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Currency:</label>
            <select
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-300 rounded font-medium text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none w-full md:min-w-[160px]"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <button onClick={handlePrint} className="w-full sm:w-auto sm:flex-none flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 shadow-sm font-medium transition-colors">
                <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={handleDownloadPDF} className="w-full sm:w-auto sm:flex-none flex items-center justify-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 shadow-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> Save PDF
            </button>
        </div>
      </div>

      <div className="bg-white p-4 md:p-8 shadow-lg rounded-xl border border-slate-200 print:shadow-none print:border-none print:p-0" id="invoice-preview">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
          <div className="flex-1 w-full order-2 md:order-1">
             {/* Logo Area */}
             <div className="mb-6">
                {logo ? (
                    <div className="relative group inline-block">
                        <img src={logo} alt="Company Logo" className="h-20 md:h-24 w-auto object-contain" />
                        <button 
                            onClick={() => setLogo(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity no-print shadow-sm"
                            title="Remove Logo"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <label className="inline-flex flex-col items-center justify-center w-full md:w-32 h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-brand-400 transition-all no-print group">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-500 mb-1 transition-colors" />
                        <span className="text-xs text-slate-500 group-hover:text-brand-600 font-medium">Add Logo</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                )}
             </div>
          </div>
          <div className="text-left md:text-right w-full md:w-auto order-1 md:order-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">INVOICE</h1>
            <div className="flex flex-col md:items-end gap-1">
                <div className="flex items-center md:justify-end">
                    <span className="text-slate-500 font-medium mr-2">#</span>
                    <input 
                        type="text" 
                        value={invoiceNumber} 
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-full md:w-32 text-left md:text-right p-1 border border-transparent hover:border-slate-300 rounded text-slate-700 font-medium focus:outline-none focus:border-brand-300 print:border-none bg-transparent" 
                    />
                </div>
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full md:w-auto text-left md:text-right p-1 border border-transparent hover:border-slate-300 rounded text-slate-600 focus:outline-none focus:border-brand-300 print:border-none bg-transparent"
                />
            </div>
          </div>
        </div>

        {/* From / To */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">From</h3>
            <textarea 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full h-24 p-2 border border-slate-100 bg-slate-50 rounded resize-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder-slate-300 print:bg-transparent print:border-none print:p-0 text-sm md:text-base"
              placeholder="Your Company Details"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
            <textarea 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full h-24 p-2 border border-slate-100 bg-slate-50 rounded resize-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder-slate-300 print:bg-transparent print:border-none print:p-0 text-sm md:text-base"
              placeholder="Client Details"
            />
          </div>
        </div>

        {/* Items */}
        <div className="mb-8">
          {/* Desktop Headers */}
          <div className="hidden md:grid grid-cols-12 gap-4 mb-2 px-2 py-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 print:bg-slate-100 print:grid">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          <div className="space-y-4 md:space-y-1">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center p-4 md:p-2 rounded bg-slate-50 md:bg-transparent md:hover:bg-slate-50 group transition-colors border md:border-none border-slate-100 print:hover:bg-transparent">
                <div className="col-span-1 md:col-span-6">
                  <label className="md:hidden text-xs font-bold text-slate-400 uppercase block mb-1">Description</label>
                  <input 
                    type="text" 
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="w-full bg-transparent border-b border-transparent focus:border-brand-300 focus:outline-none py-1 print:border-none font-medium"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:contents">
                    <div className="col-span-1 md:col-span-2">
                       <label className="md:hidden text-xs font-bold text-slate-400 uppercase block mb-1">Qty</label>
                       <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full md:text-right bg-transparent border-b border-transparent focus:border-brand-300 focus:outline-none py-1 print:border-none"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                       <label className="md:hidden text-xs font-bold text-slate-400 uppercase block mb-1">Price</label>
                       <div className="flex items-center md:justify-end border-b border-transparent focus-within:border-brand-300 print:border-none">
                           <span className="text-slate-400 mr-1 text-xs">{currency}</span>
                           <input 
                            type="number" 
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full md:w-20 md:text-right bg-transparent focus:outline-none py-1"
                            step="0.01"
                          />
                       </div>
                    </div>
                    <div className="col-span-2 md:col-span-2 flex items-center justify-between md:justify-end gap-2 mt-2 md:mt-0">
                      <label className="md:hidden text-xs font-bold text-slate-400 uppercase">Total</label>
                      <div className="flex items-center gap-4">
                          <span className="font-medium text-slate-700">{currency}{(item.quantity * item.price).toFixed(2)}</span>
                          <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 no-print transition-opacity">
                            <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={addItem} className="mt-4 w-full md:w-auto flex items-center justify-center gap-1 text-sm text-brand-600 hover:text-brand-800 font-medium no-print px-4 py-2 hover:bg-brand-50 rounded transition-colors border border-dashed border-brand-200 hover:border-brand-400">
            <Plus className="w-4 h-4" /> Add Line Item
          </button>
        </div>

        {/* Totals */}
        <div className="flex justify-end break-inside-avoid">
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1">
                Tax 
                <div className="relative flex items-center">
                  <input 
                    type="number" 
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-12 p-0.5 border border-slate-200 rounded text-xs text-center no-print focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                  <span className="ml-1 print:hidden">%</span>
                  <span className="hidden print:inline ml-1">{taxRate}%</span>
                </div>
              </span>
              <span>{currency}{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-800 border-t border-slate-200 pt-3">
              <span>Total</span>
              <span>{currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
           <textarea 
             className="w-full text-center bg-transparent border-none resize-none focus:ring-0 text-slate-400 placeholder-slate-300 print:p-0"
             defaultValue="Thank you for your business!"
             rows={2}
           />
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
