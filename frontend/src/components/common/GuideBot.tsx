import React, { useState } from 'react';
import { HelpCircle, X, Sparkles } from 'lucide-react';

export const GuideBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickTips = [
    { text: "How do I create an agent?", response: "Click 'Create New Agent' or use the AI Wizard for guided setup!" },
    { text: "What are nodes?", response: "Nodes are building blocks: Triggers start workflows, Actions do tasks, Conditions check rules, and Data sources connect to your tools." },
    { text: "How do I connect nodes?", response: "Drag from the bottom dot of one node to the top dot of another!" },
    { text: "Can I save my work?", response: "Yes! Click 'Save' in the builder. Your agents are automatically saved to your account." },
  ];

  return (
    <>
      {/* Guide Bot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center group hover:scale-110"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <HelpCircle className="w-6 h-6 text-white animate-pulse" />
        )}
      </button>

      {/* Guide Bot Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 bg-gradient-to-br from-slate-900 to-purple-900/50 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Guide Bot</h3>
                <p className="text-xs text-purple-200">Here to help! 👋</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              <p className="text-sm text-gray-300 mb-4">
                Hi! I'm your guide. Ask me anything or try these quick tips:
              </p>

              {quickTips.map((tip, i) => (
                <button
                  key={i}
                  onClick={() => alert(tip.response)}
                  className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors border border-white/10"
                >
                  💡 {tip.text}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="mt-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    alert('AI response coming soon! Connect Flask backend to enable.');
                    setMessage('');
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};