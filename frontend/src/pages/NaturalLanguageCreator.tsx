import React, { useState } from 'react';
import { Sparkles, Zap, CheckCircle, Loader2 } from 'lucide-react';

export default function NLAgentCreator() {
  const [input, setInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [agent, setAgent] = useState(null);
  const [workflow, setWorkflow] = useState([]);

  const examplePrompts = [
    "Email me top 5 expenses from Google Sheets every Sunday at 8pm",
    "Track competitor prices daily and alert if they drop",
    "Summarize my YouTube analytics and send to WhatsApp daily",
    "When I get a Gmail with 'urgent', create a Slack alert immediately",
    "Every morning, check tech news and send me AI-related headlines"
  ];

  const handleCreate = async () => {
    if (!input.trim()) return;
    
    setIsCreating(true);
    setWorkflow([]);
    
    // Simulate AI understanding and building
    const steps = [
      { icon: '🧠', text: 'Understanding your request...', delay: 800 },
      { icon: '🔍', text: 'Identifying data sources...', delay: 1000 },
      { icon: '⚡', text: 'Designing workflow...', delay: 1200 },
      { icon: '🤖', text: 'Creating AI agent...', delay: 1000 },
      { icon: '✅', text: 'Agent ready!', delay: 500 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setWorkflow(prev => [...prev, step]);
    }

    // Create the agent
    const newAgent = {
      name: input.split(' ').slice(0, 5).join(' '),
      triggers: detectTriggers(input),
      actions: detectActions(input),
      schedule: detectSchedule(input),
      description: input
    };

    setAgent(newAgent);
    setIsCreating(false);
  };

  const detectTriggers = (text) => {
    if (text.includes('email') || text.includes('gmail')) return ['📧 Email Trigger'];
    if (text.includes('every') || text.includes('daily')) return ['📅 Schedule Trigger'];
    if (text.includes('when') || text.includes('if')) return ['⚡ Event Trigger'];
    return ['🔔 Webhook Trigger'];
  };

  const detectActions = (text) => {
    const actions = [];
    if (text.includes('email') || text.includes('send')) actions.push('📨 Send Email');
    if (text.includes('slack') || text.includes('alert')) actions.push('💬 Slack Message');
    if (text.includes('whatsapp')) actions.push('📱 WhatsApp');
    if (text.includes('summarize') || text.includes('analyze')) actions.push('🤖 AI Analysis');
    if (text.includes('track') || text.includes('check')) actions.push('🔍 Web Scraper');
    return actions.length > 0 ? actions : ['✅ Execute Action'];
  };

  const detectSchedule = (text) => {
    if (text.includes('daily') || text.includes('every day')) return '🕐 Daily';
    if (text.includes('sunday') || text.includes('monday')) return '📅 Weekly';
    if (text.includes('morning')) return '🌅 9:00 AM';
    if (text.includes('8pm') || text.includes('evening')) return '🌙 8:00 PM';
    return '⚡ Real-time';
  };

  const reset = () => {
    setInput('');
    setAgent(null);
    setWorkflow([]);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Agent Builder</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Talk to Create Agents
          </h1>
          <p className="text-xl text-gray-400">
            Describe what you want in plain English. We'll build it instantly.
          </p>
        </div>

        {/* Main Input Area */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
          <label className="block text-white font-medium mb-3">
            What do you want your AI agent to do?
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: Email me my top 5 expenses from Google Sheets every Sunday at 8pm"
            className="w-full h-32 bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:border-purple-500 focus:outline-none resize-none placeholder-gray-500"
            disabled={isCreating}
          />
          
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleCreate}
              disabled={isCreating || !input.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Create Agent Instantly
                </>
              )}
            </button>
            {agent && (
              <button
                onClick={reset}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
              >
                New Agent
              </button>
            )}
          </div>
        </div>

        {/* Example Prompts */}
        {!isCreating && !agent && (
          <div className="mb-8">
            <p className="text-gray-400 text-sm mb-3">Try these examples:</p>
            <div className="grid gap-2">
              {examplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt)}
                  className="text-left bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-3 rounded-lg transition-all border border-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Creation Process */}
        {isCreating && workflow.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              Building Your Agent
            </h3>
            <div className="space-y-3">
              {workflow.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-gray-300 animate-fade-in"
                >
                  <span className="text-2xl">{step.icon}</span>
                  <span>{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Created Agent */}
        {agent && !isCreating && (
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-2xl font-bold text-white">Agent Created Successfully!</h3>
                <p className="text-purple-200">Ready to automate your workflow</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-2">Agent Name</h4>
              <p className="text-purple-200">{agent.name}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2 text-sm">Triggers</h4>
                <div className="space-y-2">
                  {agent.triggers.map((trigger, idx) => (
                    <div key={idx} className="text-purple-200 text-sm">{trigger}</div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2 text-sm">Actions</h4>
                <div className="space-y-2">
                  {agent.actions.map((action, idx) => (
                    <div key={idx} className="text-purple-200 text-sm">{action}</div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-2 text-sm">Schedule</h4>
                <div className="text-purple-200 text-sm">{agent.schedule}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all">
                Deploy Agent
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all">
                View Workflow
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}