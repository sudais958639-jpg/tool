
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import { ArrowLeft, Star, Share2 } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import ShareModal from '../components/ShareModal';
import InvoiceGenerator from '../tools/InvoiceGenerator';
import InvestmentCalculator from '../tools/InvestmentCalculator';
import QRCodeGenerator from '../tools/QRCodeGenerator';
import ImageBase64 from '../tools/ImageBase64';
import UnitConverter from '../tools/UnitConverter';
import AICodeGenerator from '../tools/AICodeGenerator';
import TimezoneConverter from '../tools/TimezoneConverter';
import PluginBuilder from '../tools/PluginBuilder';

// Imported Collections
import * as Calc from '../tools/Calculators';
import * as Text from '../tools/TextCodeTools';
import * as Media from '../tools/MediaNetworkTools';
import * as AI from '../tools/AITools';

const SingleTool: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tool = TOOLS.find(t => t.path.includes(id || ''));
  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Tool Not Found</h2>
        <Link to="/tools" className="text-brand-600 hover:underline mt-4 inline-block">Back to All Tools</Link>
      </div>
    );
  }

  const renderTool = () => {
    switch (tool.id) {
      // AI TOOLS
      case 'ai-chat': return <AI.AIChat />;
      case 'ai-image-generator': return <AI.AIImageGenerator />;
      case 'ai-summarizer': return <AI.AISummarizer />;
      case 'ai-coder': return <AICodeGenerator />;
      case 'plugin-builder': return <PluginBuilder />;

      // EXISTING
      case 'invoice-generator': return <InvoiceGenerator />;
      case 'investment-calculator': return <InvestmentCalculator />;
      case 'qr-generator': return <QRCodeGenerator />;
      case 'image-base64': return <ImageBase64 />;
      case 'unit-converter': return <UnitConverter />;

      // CALCULATORS
      case 'bmi-calculator': return <Calc.BMICalculator />;
      case 'age-calculator': return <Calc.AgeCalculator />;
      case 'date-diff': return <Calc.DateDiffCalculator />;
      case 'timezone-converter': return <TimezoneConverter />;
      case 'sales-tax': return <Calc.FinancialCalculator type="sales" />;
      case 'discount-calculator': return <Calc.FinancialCalculator type="discount" />;
      case 'margin-calculator': return <Calc.FinancialCalculator type="margin" />;
      case 'gst-calculator': return <Calc.FinancialCalculator type="gst" />;
      case 'paypal-fee': return <Calc.FinancialCalculator type="paypal" />;
      case 'currency': return <Calc.CurrencyConverter />;
      case 'binary-calc': return <Calc.BinaryCalculator />;
      case 'fibonacci': return <Calc.FibonacciCalculator />;
      case 'confidence-interval': return <Calc.ConfidenceInterval />;

      // TEXT / DEV
      case 'uuid-generator': return <Text.UUIDGenerator />;
      case 'password-generator': return <Text.PasswordGenerator />;
      case 'lorem-ipsum': return <Text.LoremIpsum />;
      case 'case-converter': return <Text.TextCaseConverter />;
      case 'word-counter': return <Text.WordCounter />;
      case 'remove-breaks': return <Text.RemoveLineBreaks />;
      case 'sha256': return <Text.HashGenerator type="SHA-256" />;
      case 'md5': return <Text.MD5Generator />;
      case 'url-encoder': return <Text.UrlEncoder />;
      case 'regex-tester': return <Text.RegexTester />;
      case 'json-formatter': return <Text.JsonFormatter />;
      case 'random-word': return <Text.RandomWordGenerator />;
      case 'stylish-text': return <Text.StylishTextGenerator />;
      
      // CODE MINIFIERS
      case 'html-minifier': return <Text.CodeMinifier lang="html" />;
      case 'css-minifier': return <Text.CodeMinifier lang="css" />;
      case 'js-minifier': return <Text.CodeMinifier lang="js" />;
      
      // CODE BEAUTIFIERS
      case 'html-beautifier': return <Text.CodeBeautifier lang="html" />;
      case 'css-beautifier': return <Text.CodeBeautifier lang="css" />;
      case 'js-beautifier': return <Text.CodeBeautifier lang="js" />;
      
      // MEDIA
      case 'image-compressor': return <Media.ImageCompressor />;
      case 'image-resizer': return <Media.ImageResizer />;
      case 'ocr-tool': return <Media.OCRTool />;
      case 'youtube-thumbnail': return <Media.YouTubeThumbnail />;
      case 'color': return <Media.ColorPicker />;
      case 'whois': return <Media.WhoisLookup />;
      case 'ssl-checker': return <Media.SSLChecker />;
      case 'typing-test': return <Media.TypingTest />;
      case 'favicon-generator': return <Media.FaviconGenerator />;

      default: 
        return (
          <div className="bg-white p-8 md:p-12 text-center rounded-xl border border-slate-200">
            <div className="inline-block p-4 bg-yellow-50 rounded-full text-yellow-600 mb-4">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Coming Soon</h3>
            <p className="text-slate-500">This tool is currently under development. Check back later!</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-4 md:mb-6 flex items-center justify-between no-print">
        <Link to="/tools" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition text-sm md:text-base">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <button 
          onClick={() => setIsShareOpen(true)}
          className="flex items-center gap-2 text-brand-600 font-medium text-sm hover:bg-brand-50 px-3 py-1.5 rounded-lg transition"
        >
          <Share2 className="w-4 h-4" /> Share Tool
        </button>
      </div>

      <div className="mb-6 md:mb-8 no-print">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4 text-center md:text-left">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-brand-600 shrink-0 mx-auto md:mx-0">
             <tool.icon className="w-7 h-7 md:w-8 md:h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{tool.name}</h1>
            <p className="text-slate-500 text-sm md:text-base mt-1">{tool.description}</p>
          </div>
        </div>
      </div>

      {/* Ad Below Header */}
      <div className="mb-6 md:mb-8 no-print w-full">
        <AdUnit type="header" />
      </div>

      {/* Tool Container - Adjusted padding for mobile */}
      <div className="bg-white p-3 sm:p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 min-h-[300px] md:min-h-[400px]">
         {renderTool()}
      </div>

      <div className="mt-8 bg-white p-5 md:p-8 rounded-xl border border-slate-100 no-print">
        <h2 className="text-xl font-bold text-slate-800 mb-4">About {tool.name}</h2>
        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
          The {tool.name} is designed to simplify your workflow. Whether you are a developer, designer, or business owner, 
          this tool provides a quick and reliable way to handle your tasks. It runs entirely in your browser for maximum security and speed.
        </p>
        <div className="mt-6">
          <h3 className="font-semibold text-slate-700 mb-2">How to use</h3>
          <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm md:text-base">
            <li>Input your data into the fields provided.</li>
            <li>Adjust settings as needed using the configuration options.</li>
            <li>View results instantly in real-time.</li>
            <li>Download or copy the output for your use.</li>
          </ul>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={`Check out this ${tool.name} on ToolMaster Pro`}
        url={window.location.href}
        description={tool.description}
      />
    </div>
  );
};

export default SingleTool;
