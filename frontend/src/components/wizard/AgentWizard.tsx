import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Loader } from 'lucide-react';

interface AgentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (description: string) => void;
}

export const AgentWizard: React.FC<AgentWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Summarize my daily emails and send me a digest",
    "Monitor competitor websites and alert me of changes",
    "Schedule meetings based on my calendar availability",
    "Auto-reply to customer support emails",
    "Extract data from websites to spreadsheet",
    "Summarize YouTube videos in my watchlist",
  ];

  const handleContinue = () => {
    if (step === 1 && description.trim()) {
      setStep(2);
      setLoading(true);
      
      // Simulate AI processing
      setTimeout(() => {
        setLoading(false);
        onComplete(description);
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setStep(1);
    setDescription('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900/50 rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Create Your AI Agent</h2>
                <p className="text-sm text-purple-200">Tell me what you want to automate</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3">
                  What would you like to automate?
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type anything like: 'Send me daily summaries of my emails' or 'Monitor competitor websites and alert me'..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-3">Popular examples:</p>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setDescription(suggestion)}
                      className="text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors border border-white/10"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!description.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && loading && (
            <div className="text-center py-12">
              <Loader className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Creating Your Agent...</h3>
              <p className="text-gray-400">AI is building your workflow</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};