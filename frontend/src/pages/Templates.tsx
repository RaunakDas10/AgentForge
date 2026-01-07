import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { TemplatesGallery } from '../components/templates/TemplatesGallery';

interface TemplatesProps {
  onBack: () => void;
  onUseTemplate: (templateId: string) => void;
}

export const Templates: React.FC<TemplatesProps> = ({ onBack, onUseTemplate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Agent Templates</h1>
                <p className="text-gray-400">Start with pre-built workflows</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <TemplatesGallery onUseTemplate={onUseTemplate} />
      </div>
    </div>
  );
};