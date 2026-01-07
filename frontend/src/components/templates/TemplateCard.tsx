import React from 'react';
import { Play, Eye } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: number;
  icon: React.ReactNode;
  color: string;
}

interface TemplateCardProps {
  template: Template;
  onUse: () => void;
  onPreview: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse, onPreview }) => {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 group">
      <div className={`w-16 h-16 ${template.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {template.icon}
      </div>
      
      <div className="mb-4">
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full">
          {template.category}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
      <p className="text-sm text-gray-400 mb-4">{template.description}</p>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        <span>{template.nodes} nodes</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPreview}
          className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
        <button
          onClick={onUse}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          Use
        </button>
      </div>
    </div>
  );
};