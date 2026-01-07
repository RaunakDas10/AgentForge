import React, { useState } from 'react';
import { Mail, Calendar, Globe, Database, Video, Zap, FileText, TrendingUp } from 'lucide-react';
import { TemplateCard } from './TemplateCard';

const templates = [
  {
    id: 'email-assistant',
    name: 'Email Assistant',
    description: 'Auto-categorize and respond to emails with AI-powered replies',
    category: 'Communication',
    nodes: 5,
    icon: <Mail className="w-8 h-8 text-white" />,
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  {
    id: 'meeting-scheduler',
    name: 'Meeting Scheduler',
    description: 'Automatically schedule meetings based on calendar availability',
    category: 'Productivity',
    nodes: 6,
    icon: <Calendar className="w-8 h-8 text-white" />,
    color: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  {
    id: 'web-scraper',
    name: 'Web Data Scraper',
    description: 'Extract data from websites and save to spreadsheet',
    category: 'Data Collection',
    nodes: 4,
    icon: <Globe className="w-8 h-8 text-white" />,
    color: 'bg-gradient-to-br from-purple-500 to-pink-600'
  },
  {
    id: 'news-summarizer',
    name: 'News Summarizer',
    description: 'Daily news digest with AI-powered summaries',
    category: 'Content',
    nodes: 5,
    icon: <FileText className="w-8 h-8 text-white" />,
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  },
  {
    id: 'youtube-analyzer',
    name: 'YouTube Analyzer',
    description: 'Summarize videos and extract key insights',
    category: 'Content',
    nodes: 4,
    icon: <Video className="w-8 h-8 text-white" />,
    color: 'bg-gradient-to-br from-red-500 to-pink-600'
  },
  {
    id: 'data-sync',
    name: 'Data Synchronizer',
    description: 'Sync data between databases and spreadsheets',
    category: 'Data Management',
    nodes: 7,
    icon: <Database className="w-8 h-8 text-white" />,
    color: 'bg-gradient-to-br from-cyan-500 to-blue-600'
  },
  {
    id: 'social-monitor',
    name: 'Social Media Monitor',
    description: 'Track mentions and sentiment across platforms',
    category: 'Marketing',
    nodes: 6,
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    color: 'bg-gradient-to-br from-pink-500 to-rose-600'
  },
  {
    id: 'alert-system',
    name: 'Alert System',
    description: 'Monitor conditions and send instant notifications',
    category: 'Monitoring',
    nodes: 5,
    icon: <Zap className="w-8 h-8 text-white" />,
    color: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
];

interface TemplatesGalleryProps {
  onUseTemplate: (templateId: string) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onUseTemplate }) => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = filter === 'All' 
    ? templates 
    : templates.filter(t => t.category === filter);

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`
              px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap
              ${filter === category 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onUse={() => onUseTemplate(template.id)}
            onPreview={() => alert('Preview coming soon!')}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">No templates found in this category</p>
        </div>
      )}
    </div>
  );
};