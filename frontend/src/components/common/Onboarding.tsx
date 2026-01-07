import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle, Zap } from 'lucide-react';

interface OnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ isOpen, onComplete, onSkip }) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to AgentForge! 🎉",
      description: "You're about to discover the easiest way to build AI agents. Let's get you started!",
      image: <Sparkles className="w-24 h-24 text-purple-400 animate-pulse" />,
    },
    {
      title: "Build Agents Visually",
      description: "Drag and drop nodes to create powerful workflows. No coding required!",
      image: (
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg animate-float" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      ),
    },
    {
      title: "AI-Powered Automation",
      description: "Connect to emails, databases, APIs, and more. Let AI handle the complex stuff!",
      image: <Zap className="w-24 h-24 text-yellow-400 animate-bounce" />,
    },
    {
      title: "Ready to Build?",
      description: "Start with a template or use the AI wizard to create your first agent!",
      image: <CheckCircle className="w-24 h-24 text-green-400 animate-pulse" />,
    },
  ];

  const currentStep = steps[step - 1];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900/50 rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-8 text-center relative">
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="flex justify-center mb-6">
            {currentStep.image}
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            {currentStep.title}
          </h2>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            {currentStep.description}
          </p>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i + 1 === step ? 'w-8 bg-purple-500' : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              {step < steps.length && (
                <button
                  onClick={onSkip}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
              >
                {step < steps.length ? 'Next' : 'Get Started'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};