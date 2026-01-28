import { Mail, Calendar, Globe, Database, Video, Zap, FileText, TrendingUp, Activity, Edit3, QrCode } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TemplateInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean';
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: string }[]; // For select inputs
  required?: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  icon: LucideIcon;
  color: string;
  inputs: TemplateInput[];
  apiEndpoint: string; // The backend route to call
  nodes?: number; // Visual indicator of complexity
}

export const templates: Template[] = [

  {
    id: 'meeting-scheduler',
    name: 'EventForge',
    description: 'Automatically schedule meetings based on calendar availability',
    category: 'Productivity',
    icon: Calendar,
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    nodes: 6,
    apiEndpoint: '/api/agents/scheduler/run',
    inputs: [
      {
        id: 'calendar_url',
        label: 'Calendar Link',
        type: 'text',
        placeholder: 'https://cal.com/username',
        required: true
      }
    ]
  },
  {
    id: 'data-sync',
    name: 'ReadyMade INVOICE GENERATOR',
    description: 'Create professional, print-ready invoices with real-time calculations.',
    category: 'Productivity',
    icon: Database,
    color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    nodes: 7,
    apiEndpoint: '/api/agents/sync/run',
    inputs: [
      {
        id: 'source_db',
        label: 'Source Database',
        type: 'text',
        required: true
      },
      {
        id: 'dest_sheet',
        label: 'Destination Sheet ID',
        type: 'text',
        required: true
      }
    ]
  },
  {
    id: 'alert-system',
    name: 'ALERT KERNEL',
    description: 'Monitor conditions and send instant notifications',
    category: 'Monitoring',
    icon: Zap,
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    nodes: 5,
    apiEndpoint: '/api/agents/alert/run',
    inputs: [
      {
        id: 'condition',
        label: 'Alert Condition',
        type: 'textarea',
        placeholder: 'If stock price > 150',
        required: true
      }
    ]
  },
  {
    id: 'financial-stress',
    name: 'Financial Stress Analyzer',
    description: 'Analyze financial health and stress levels based on transaction patterns.',
    category: 'Finance',
    icon: TrendingUp,
    color: 'bg-gradient-to-br from-rose-500 to-orange-600',
    nodes: 8,
    apiEndpoint: '', // Client-side
    inputs: [
      {
        id: 'initial_balance',
        label: 'Monthly Income',
        type: 'number',
        placeholder: 'e.g., 50000',
        required: true
      }
    ]
  },
  {
    id: 'medicare',
    name: 'MediCare',
    description: 'Instant drug information and usage guide from openFDA.',
    category: 'Health',
    icon: Zap,
    color: 'bg-gradient-to-br from-teal-500 to-green-600',
    nodes: 3,
    apiEndpoint: '',
    inputs: [
      {
        id: 'medicine_name',
        label: 'Medicine Name',
        type: 'text',
        placeholder: 'e.g., Aspirin',
        required: true
      }
    ]
  },
  {
    id: 'medsage-lite',
    name: 'MedSage Lite',
    description: 'Deterministic clinical extraction & risk assessment (No-API)',
    category: 'Health',
    icon: Activity,
    color: 'bg-gradient-to-br from-emerald-500 to-cyan-600',
    nodes: 8,
    apiEndpoint: '',
    inputs: [] // No inputs needed for initial routing as it has its own UI
  },
  {
    id: 'web-scraper',
    name: 'LinkGuard',
    description: 'Extract data from websites and save to spreadsheet',
    category: 'Data Collection',
    icon: Globe,
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    nodes: 4,
    apiEndpoint: '/api/agents/scraper/run',
    inputs: [
      {
        id: 'target_url',
        label: 'Target URL',
        type: 'text',
        placeholder: 'https://example.com/products',
        required: true
      },
      {
        id: 'data_points',
        label: 'Data to Extract',
        type: 'textarea',
        placeholder: 'Product Name, Price, Rating',
        required: true
      }
    ]
  },
  {
    id: 'news-summarizer',
    name: 'NewsChef',
    description: 'Daily news digest with AI-powered summaries',
    category: 'Content',
    icon: FileText,
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    nodes: 5,
    apiEndpoint: '/api/agents/news/run',
    inputs: [
      {
        id: 'topics',
        label: 'Topics',
        type: 'text',
        placeholder: 'AI, Tech, Finance',
        required: true
      }
    ]
  },
  {
    id: 'grammar-x',
    name: 'GrammarX',
    description: 'Free improvised grammar and spell checker',
    category: 'Writing',
    icon: Edit3,
    color: 'bg-gradient-to-br from-purple-600 to-indigo-600',
    nodes: 5,
    apiEndpoint: '', // Client-side logic usage
    inputs: []
  },
  {
    id: 'link-to-qr',
    name: 'Link to QR',
    description: 'Generate QR codes from links or text instantly',
    category: 'Utilities',
    icon: QrCode,
    color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    nodes: 1,
    apiEndpoint: '', // Client-side
    inputs: [
      {
        id: 'url',
        label: 'URL or Text',
        type: 'text',
        placeholder: 'https://example.com',
        required: true
      }
    ]
  },
  {
    id: 'youtube-analyzer',
    name: 'YouTube Analyzer',
    description: 'Summarize videos and extract key insights',
    category: 'Content',
    icon: Video,
    color: 'bg-gradient-to-br from-red-500 to-pink-600',
    nodes: 4,
    apiEndpoint: '/api/agents/youtube/run',
    inputs: [
      {
        id: 'video_url',
        label: 'YouTube Video URL',
        type: 'text',
        placeholder: 'https://youtube.com/watch?v=...',
        required: true
      }
    ]
  },
  {
    id: 'social-monitor',
    name: 'Social Media Monitor',
    description: 'Track mentions and sentiment across platforms',
    category: 'Marketing',
    icon: TrendingUp,
    color: 'bg-gradient-to-br from-pink-500 to-rose-600',
    nodes: 6,
    apiEndpoint: '/api/agents/social/run',
    inputs: [
      {
        id: 'keywords',
        label: 'Keywords to Track',
        type: 'text',
        placeholder: '#AI, @AgentForge',
        required: true
      }
    ]
  },
  {
    id: 'email-assistant',
    name: 'Email Assistant',
    description: 'Auto-categorize and respond to emails with AI-powered replies',
    category: 'Communication',
    icon: Mail,
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    nodes: 5,
    apiEndpoint: '/api/agents/email-assistant/run',
    inputs: [
      {
        id: 'email_provider',
        label: 'Email Provider',
        type: 'select',
        options: [
          { label: 'Gmail', value: 'gmail' },
          { label: 'Outlook', value: 'outlook' }
        ],
        required: true
      },
      {
        id: 'response_style',
        label: 'Response Style',
        type: 'select',
        options: [
          { label: 'Professional', value: 'professional' },
          { label: 'Friendly', value: 'friendly' },
          { label: 'Concise', value: 'concise' }
        ],
        defaultValue: 'professional'
      }
    ]
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(t => t.id === id);
};
