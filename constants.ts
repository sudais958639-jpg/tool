
import { 
  Calculator, 
  FileText, 
  QrCode, 
  Image as ImageIcon, 
  Code, 
  DollarSign, 
  Repeat, 
  Type,
  Binary,
  Hash,
  Palette,
  Percent,
  Activity,
  Calendar,
  Globe,
  BarChart,
  CreditCard,
  Lock,
  Key,
  Link,
  FileCode,
  Video,
  Wifi,
  Keyboard,
  ShieldCheck,
  Scissors,
  Eye,
  Music,
  MessageSquare,
  ImagePlus,
  Sparkles,
  Plug
} from 'lucide-react';
import { ToolDef, ToolCategory } from './types';

export const TOOLS: ToolDef[] = [
  // AI TOOLS
  {
    id: 'ai-chat',
    name: 'AI Chat Assistant',
    description: 'Chat with an intelligent AI assistant powered by Gemini.',
    category: ToolCategory.AI,
    icon: MessageSquare,
    popular: true,
    path: '/tool/ai-chat'
  },
  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'Generate unique images from text descriptions.',
    category: ToolCategory.AI,
    icon: ImagePlus,
    popular: true,
    path: '/tool/ai-image-generator'
  },
  {
    id: 'ai-summarizer',
    name: 'AI Text Summarizer',
    description: 'Summarize long articles or text into concise points.',
    category: ToolCategory.AI,
    icon: FileText,
    path: '/tool/ai-summarizer'
  },
  {
    id: 'ai-coder',
    name: 'AI Code Generator',
    description: 'Generate HTML/CSS snippets using AI.',
    category: ToolCategory.AI,
    icon: Code,
    popular: true,
    path: '/tool/ai-coder'
  },
  {
    id: 'plugin-builder',
    name: 'WP Plugin Builder',
    description: 'Create custom WordPress plugins instantly with AI.',
    category: ToolCategory.AI,
    icon: Plug,
    popular: true,
    path: '/tool/plugin-builder'
  },

  // EXISTING TOOLS
  {
    id: 'invoice-generator',
    name: 'Invoice Generator',
    description: 'Create professional PDF invoices in seconds.',
    category: ToolCategory.FINANCE,
    icon: FileText,
    popular: true,
    path: '/tool/invoice-generator'
  },
  {
    id: 'investment-calculator',
    name: 'Investment Calculator',
    description: 'Calculate compound interest and visualize growth.',
    category: ToolCategory.FINANCE,
    icon: Calculator,
    popular: true,
    path: '/tool/investment-calculator'
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate custom QR codes for URLs, text, and more.',
    category: ToolCategory.DEVELOPER,
    icon: QrCode,
    popular: true,
    path: '/tool/qr-generator'
  },
  {
    id: 'image-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 strings for embedding.',
    category: ToolCategory.IMAGE,
    icon: ImageIcon,
    path: '/tool/image-base64'
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between Metric and Imperial units.',
    category: ToolCategory.CONVERTER,
    icon: Repeat,
    path: '/tool/unit-converter'
  },

  // HEALTH
  { id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate Body Mass Index instantly.', category: ToolCategory.CONVERTER, icon: Activity, path: '/tool/bmi-calculator' },

  // DATE / TIME
  { id: 'age-calculator', name: 'Age Calculator', description: 'Calculate age from birth date.', category: ToolCategory.CONVERTER, icon: Calendar, path: '/tool/age-calculator' },
  { id: 'timezone-converter', name: 'Time Zone Converter', description: 'Convert between different time zones.', category: ToolCategory.CONVERTER, icon: Globe, path: '/tool/timezone-converter' },
  { id: 'date-diff', name: 'Date Duration Calc', description: 'Convert between days, hours, months.', category: ToolCategory.CONVERTER, icon: Calendar, path: '/tool/date-diff' },

  // STATISTICS
  { id: 'confidence-interval', name: 'Confidence Interval', description: 'Compute confidence intervals for data sets.', category: ToolCategory.FINANCE, icon: BarChart, path: '/tool/confidence-interval' },

  // FINANCE
  { id: 'sales-tax', name: 'Sales Tax Calculator', description: 'Calculate sales tax for purchases.', category: ToolCategory.FINANCE, icon: DollarSign, path: '/tool/sales-tax' },
  { id: 'discount-calculator', name: 'Discount Calculator', description: 'Calculate discounts on prices.', category: ToolCategory.FINANCE, icon: Percent, path: '/tool/discount-calculator' },
  { id: 'margin-calculator', name: 'Margin Calculator', description: 'Compute profit margins.', category: ToolCategory.FINANCE, icon: Calculator, path: '/tool/margin-calculator' },
  { id: 'paypal-fee', name: 'PayPal Fee Calculator', description: 'Calculate PayPal transaction fees.', category: ToolCategory.FINANCE, icon: CreditCard, path: '/tool/paypal-fee' },
  { id: 'gst-calculator', name: 'GST Calculator', description: 'Calculate GST for items.', category: ToolCategory.FINANCE, icon: Calculator, path: '/tool/gst-calculator' },
  { id: 'currency', name: 'Currency Converter', description: 'Real-time exchange rates.', category: ToolCategory.FINANCE, icon: DollarSign, path: '/tool/currency' },

  // MATH / DEV
  { id: 'binary-calc', name: 'Binary Calculator', description: 'Perform binary calculations.', category: ToolCategory.DEVELOPER, icon: Binary, path: '/tool/binary-calc' },
  { id: 'fibonacci', name: 'Fibonacci Calculator', description: 'Generate Fibonacci series.', category: ToolCategory.DEVELOPER, icon: Calculator, path: '/tool/fibonacci' },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate unique UUIDs.', category: ToolCategory.DEVELOPER, icon: Key, path: '/tool/uuid-generator' },
  { id: 'password-generator', name: 'Password Generator', description: 'Generate secure passwords.', category: ToolCategory.DEVELOPER, icon: Lock, path: '/tool/password-generator' },
  { id: 'sha256', name: 'SHA-256 Generator', description: 'Secure text hashing.', category: ToolCategory.DEVELOPER, icon: Hash, path: '/tool/sha256' },
  { id: 'md5', name: 'MD5 Generator', description: 'Create MD5 hashes.', category: ToolCategory.DEVELOPER, icon: Hash, path: '/tool/md5' },
  { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Encode or decode URLs.', category: ToolCategory.DEVELOPER, icon: Link, path: '/tool/url-encoder' },

  // CODE MINIFIERS / BEAUTIFIERS
  { id: 'html-minifier', name: 'HTML Minifier', description: 'Compress HTML code.', category: ToolCategory.DEVELOPER, icon: FileCode, path: '/tool/html-minifier' },
  { id: 'css-minifier', name: 'CSS Minifier', description: 'Compress CSS code.', category: ToolCategory.DEVELOPER, icon: FileCode, path: '/tool/css-minifier' },
  { id: 'js-minifier', name: 'JS Minifier', description: 'Compress JavaScript code.', category: ToolCategory.DEVELOPER, icon: FileCode, path: '/tool/js-minifier' },
  { id: 'html-beautifier', name: 'HTML Beautifier', description: 'Format HTML code.', category: ToolCategory.DEVELOPER, icon: Code, path: '/tool/html-beautifier' },
  { id: 'css-beautifier', name: 'CSS Beautifier', description: 'Format CSS code.', category: ToolCategory.DEVELOPER, icon: Code, path: '/tool/css-beautifier' },
  { id: 'js-beautifier', name: 'JS Beautifier', description: 'Format JavaScript code.', category: ToolCategory.DEVELOPER, icon: Code, path: '/tool/js-beautifier' },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions.', category: ToolCategory.DEVELOPER, icon: Code, path: '/tool/regex-tester' },
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format and validate JSON.', category: ToolCategory.DEVELOPER, icon: FileCode, path: '/tool/json-formatter' },

  // IMAGE TOOLS
  { id: 'image-compressor', name: 'Image Compressor', description: 'Reduce image file size.', category: ToolCategory.IMAGE, icon: ImageIcon, path: '/tool/image-compressor' },
  { id: 'image-resizer', name: 'Image Resizer', description: 'Resize images to custom dimensions.', category: ToolCategory.IMAGE, icon: Scissors, path: '/tool/image-resizer' },
  { id: 'ocr-tool', name: 'OCR Tool', description: 'Extract text from images.', category: ToolCategory.IMAGE, icon: Eye, path: '/tool/ocr-tool' },
  { id: 'favicon-generator', name: 'Favicon Generator', description: 'Create website favicons.', category: ToolCategory.IMAGE, icon: ImageIcon, path: '/tool/favicon-generator' },
  { id: 'color', name: 'Color Picker', description: 'Get Hex and RGB values.', category: ToolCategory.IMAGE, icon: Palette, path: '/tool/color' },

  // TEXT TOOLS
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text.', category: ToolCategory.DEVELOPER, icon: Type, path: '/tool/lorem-ipsum' },
  { id: 'random-word', name: 'Random Word Generator', description: 'Generate random words.', category: ToolCategory.CONVERTER, icon: Type, path: '/tool/random-word' },
  { id: 'stylish-text', name: 'Stylish Text Generator', description: 'Create styled text for social.', category: ToolCategory.CONVERTER, icon: Type, path: '/tool/stylish-text' },
  { id: 'case-converter', name: 'Text Case Converter', description: 'Convert text to uppercase, etc.', category: ToolCategory.CONVERTER, icon: Type, path: '/tool/case-converter' },
  { id: 'word-counter', name: 'Word Counter', description: 'Count words and characters.', category: ToolCategory.CONVERTER, icon: Type, path: '/tool/word-counter' },
  { id: 'remove-breaks', name: 'Remove Line Breaks', description: 'Remove extra line breaks.', category: ToolCategory.CONVERTER, icon: Type, path: '/tool/remove-breaks' },
  { id: 'typing-test', name: 'Typing Speed Test', description: 'Measure typing speed.', category: ToolCategory.CONVERTER, icon: Keyboard, path: '/tool/typing-test' },

  // OTHER
  { id: 'youtube-thumbnail', name: 'YouTube URL & Generator', description: 'Generate links, embed codes and download thumbnails.', category: ToolCategory.IMAGE, icon: Video, path: '/tool/youtube-thumbnail' },
  { id: 'whois', name: 'Whois Lookup', description: 'Lookup domain status, age, and ownership.', category: ToolCategory.DEVELOPER, icon: Globe, path: '/tool/whois' },
  { id: 'ssl-checker', name: 'SSL Checker', description: 'Check SSL certificate validity.', category: ToolCategory.DEVELOPER, icon: ShieldCheck, path: '/tool/ssl-checker' },
];

export const CATEGORIES = Object.values(ToolCategory);
