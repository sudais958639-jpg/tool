import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../constants';
import { Search } from 'lucide-react';
import AdUnit from '../components/AdUnit';

const AllTools: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(filter.toLowerCase()) || tool.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Tool Library</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
             <input 
               type="text" 
               placeholder="Search for tools..."
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
             />
             <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
           </div>
           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
             <button 
               onClick={() => setActiveCategory('All')}
               className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeCategory === 'All' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
             >
               All
             </button>
             {CATEGORIES.map(cat => (
                <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeCategory === cat ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Ad Below Header */}
      <div className="mb-8 w-full">
        <AdUnit type="header" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.length > 0 ? filteredTools.map(tool => (
          <Link key={tool.id} to={tool.path} className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-brand-300 hover:shadow-md transition flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors shrink-0">
              <tool.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1 group-hover:text-brand-600 transition-colors">{tool.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{tool.description}</p>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2 block">{tool.category}</span>
            </div>
          </Link>
        )) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            No tools found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTools;