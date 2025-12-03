
import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import AdUnit from '../components/AdUnit';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Full Width Hero Banner */}
      <div className="w-full bg-white border-b border-slate-200 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-400 via-purple-400 to-brand-400"></div>
        {/* Adjusted padding and increased max-width to 7xl for a balanced, wide hero section */}
        <div className="container mx-auto px-4 py-20 md:py-32 text-center max-w-7xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            All Essential Online Tools <br className="hidden md:block" /> <span className="text-brand-600">In One Place!</span>
          </h1>
          {/* Increased max-width for paragraph to prevent narrow wrapping */}
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Access over 50+ free developer, financial, and design tools. No installation required. Secure, fast, and ready to use.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/tools" className="bg-brand-600 text-white px-8 py-4 rounded-full font-bold hover:bg-brand-700 transition shadow-lg hover:shadow-brand-200 text-lg">
              Explore Tools
            </Link>
            <Link to="/tool/ai-coder" className="bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition text-lg">
              Try AI Generator
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area with Container */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Ad Below Banner */}
        <div className="mb-16 flex justify-center w-full">
          <AdUnit type="header" />
        </div>

        {/* All Tools List */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">All Tools</h2>
            <p className="text-slate-500 text-lg">Browse our complete collection of free online tools.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map(tool => (
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
