
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Hexagon, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import AdUnit from './AdUnit';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Tools', path: '/tools' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-brand-600 hover:text-brand-500 transition group">
              <div className="relative">
                <Hexagon className="h-8 w-8 text-brand-600 group-hover:text-brand-500 fill-current opacity-20" />
                <Hexagon className="h-8 w-8 text-brand-600 group-hover:text-brand-500 absolute top-0 left-0" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">ToolMaster<span className="text-brand-600">Pro</span></span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Search & Mobile Menu Toggle */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <form onSubmit={handleSearch} className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Find a tool..."
                  className="w-48 lg:w-64 pl-10 pr-4 py-1.5 bg-slate-100 border-transparent focus:bg-white focus:border-brand-300 focus:ring-0 rounded-full text-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
              
              <button 
                className="md:hidden p-2 text-slate-600 rounded-md hover:bg-slate-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-lg z-50">
            <form onSubmit={handleSearch} className="mb-4 relative">
               <input
                  type="text"
                  placeholder="Search tools..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-lg border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${location.pathname === link.path ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Ad Placement Above Footer */}
      <div className="container mx-auto px-4 mt-12 no-print">
        <AdUnit type="footer" />
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-8 no-print">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 text-white mb-4">
                <Hexagon className="h-6 w-6 text-brand-400" />
                <span className="text-lg font-bold">ToolMasterPro</span>
              </div>
              <p className="text-sm text-slate-400">
                Free, fast, and secure online tools for developers, businesses, and everyone.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/tools" className="hover:text-white">All Tools</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#E1306C] hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            &copy; 2025 ToolMaster Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
