import React, { useEffect, useState } from 'react';
import { Zap, Mail, Database, Calendar, ArrowRight } from 'lucide-react';

export const HeroPreview: React.FC = () => {
  const [activeNode, setActiveNode] = useState(0);

  const nodes = [
    { icon: <Calendar className="w-6 h-6" />, label: 'Trigger: Daily 9AM', color: 'from-green-500 to-emerald-600', position: { top: '20%', left: '10%' } },
    { icon: <Mail className="w-6 h-6" />, label: 'Fetch Emails', color: 'from-blue-500 to-indigo-600', position: { top: '20%', left: '40%' } },
    { icon: <Database className="w-6 h-6" />, label: 'AI Summarize', color: 'from-purple-500 to-pink-600', position: { top: '20%', left: '70%' } },
    { icon: <Zap className="w-6 h-6" />, label: 'Send Digest', color: 'from-yellow-500 to-orange-600', position: { top: '60%', left: '40%' } },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="px-6 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30">
          <span className="text-sm font-semibold text-purple-300">Live Workflow Preview</span>
        </div>
      </div>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <div
          key={i}
          className={`absolute transition-all duration-500 ${
            activeNode === i ? 'scale-110 z-20' : 'scale-100 z-10'
          }`}
          style={{ top: node.position.top, left: node.position.left }}
        >
          <div
            className={`
              bg-gradient-to-br ${node.color} p-4 rounded-xl shadow-2xl
              ${activeNode === i ? 'ring-4 ring-white/50 shadow-purple-500/50' : ''}
              backdrop-blur-sm border border-white/20
            `}
          >
            <div className="flex flex-col items-center gap-2 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                {node.icon}
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">{node.label}</span>
            </div>
          </div>

          {/* Connection lines */}
          {i < nodes.length - 1 && activeNode >= i && (
            <div className="absolute top-1/2 left-full w-16 h-0.5 bg-gradient-to-r from-white/50 to-transparent animate-pulse" />
          )}
        </div>
      ))}

      {/* Data Flow Animation */}
      {activeNode > 0 && (
        <div className="absolute top-1/2 left-1/4 animate-ping">
          <div className="w-3 h-3 bg-purple-400 rounded-full" />
        </div>
      )}

      {/* Stats */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">500+</div>
          <div className="text-xs text-gray-400">Agents Created</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">10K+</div>
          <div className="text-xs text-gray-400">Tasks Automated</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">99.9%</div>
          <div className="text-xs text-gray-400">Uptime</div>
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
};