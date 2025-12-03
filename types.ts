import { LucideIcon } from 'lucide-react';

export enum ToolCategory {
  FINANCE = 'Finance',
  DEVELOPER = 'Developer',
  CONVERTER = 'Converter',
  IMAGE = 'Image',
  AI = 'AI Powered'
}

export interface ToolDef {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  popular?: boolean;
  path: string;
}

export interface NavLink {
  name: string;
  path: string;
}