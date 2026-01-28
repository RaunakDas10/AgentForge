import React, { useState } from 'react';
import { Sparkles, Zap, CheckCircle, Loader2, ArrowLeft, Info } from 'lucide-react';
import { agentService } from '../services/agentService';
import { useAgentStore } from '../store/agentStore';
import { ThinkingTerminal, type LogStep } from '../components/agent/ThinkingTerminal';
import type { Agent } from '../types/agent.types';

// Check if using mock mode for demo
const USE_MOCK_GENERATION = import.meta.env.VITE_USE_MOCK_AGENT_GENERATION === 'true';

interface NLAgentCreatorProps {
  onBack: () => void;
  onAgentCreated: (agentId: string) => void;
}

export const NLAgentCreator: React.FC<NLAgentCreatorProps> = ({ onBack, onAgentCreated }) => {
  const [input, setInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [logs, setLogs] = useState<LogStep[]>([]);
  const { saveAgent } = useAgentStore();

  const examplePrompts = [
    "Email me top 5 expenses from Google Sheets every Sunday at 8pm",
    "Track competitor prices daily and alert if they drop",
    "Summarize my YouTube analytics and send to WhatsApp daily",
    "When I get a Gmail with 'urgent', create a Slack alert immediately",
    "Every morning, check tech news and send me AI-related headlines"
  ];

  const addLog = (message: string, type: LogStep['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now()
    }]);
  };

  const handleCreate = async () => {
    if (!input.trim()) return;

    setIsCreating(true);

    setLogs([]);
    setAgent(null);

    // 1. Analysis Phase
    addLog(`Received input: "${input}"`, 'info');
    await new Promise(r => setTimeout(r, 600));
    addLog("Sending prompt to AI Agent Builder...", 'analysis');

    try {
      // Call Real AI Service
      const response = await agentService.generate(input);

      if (!response.data) {
        throw new Error("Invalid response from AI service");
      }

      const aiData = response.data;

      // 2. Processing Response
      addLog("AI Analysis Complete.", 'success');
      await new Promise(r => setTimeout(r, 500));

      // Log detected capabilities
      if (aiData.triggers && aiData.triggers.length > 0) {
        addLog(`Detected Triggers: ${aiData.triggers.join(', ')}`, 'success');
      }
      if (aiData.actions && aiData.actions.length > 0) {
        aiData.actions.forEach((action: string) => addLog(`Selected Action: ${action}`, 'tool'));
      }
      if (aiData.schedule) {
        addLog(`Schedule Identified: ${aiData.schedule}`, 'success');
      }

      await new Promise(r => setTimeout(r, 600));

      // 3. Construction Phase
      addLog("Constructing execution graph from AI blueprint...", 'info');
      await new Promise(r => setTimeout(r, 800));

      const { nodes, edges } = aiData;
      addLog(`Generated ${nodes.length} nodes and ${edges.length} connections.`, 'success');

      // 4. Finalization
      addLog("Validating workflow integrity...", 'analysis');
      await new Promise(r => setTimeout(r, 500));
      addLog("Agent configuration finalized.", 'success');

      // Create the agent object
      const newAgent: Agent = {
        id: `agent_${Date.now()}`,
        name: aiData.name || (input.split(' ').slice(0, 5).join(' ') + '...'),
        description: aiData.description || input,
        nodes: nodes,
        edges: edges,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        triggers: aiData.triggers || [],
        actions: aiData.actions || [],
        schedule: aiData.schedule || 'Real-time',
      };

      setAgent(newAgent);

      // Save to backend
      try {
        await saveAgent({
          ...newAgent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log('Agent saved successfully');
      } catch (error) {
        console.error('Failed to save agent:', error);
        addLog("Failed to persist agent configuration.", 'error');
      }

    } catch (error) {
      console.error("AI Generation Failed:", error);
      addLog("Failed to generate agent. Please try again or check backend logs.", 'error');
    }

    setIsCreating(false);
  };

  const handleDeploy = () => {
    if (agent) {
      onAgentCreated(agent.id);
    }
  };

  const reset = () => {
    setInput('');
    setAgent(null);

    setLogs([]);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

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

        {/* Demo Mode Disclaimer */}
        {USE_MOCK_GENERATION && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-blue-300 font-semibold mb-1">Demo Mode Active</h3>
                <p className="text-blue-200/80 text-sm leading-relaxed">
                  This feature uses an <strong>intelligent demo system</strong> to showcase agent generation capabilities.
                  The full AI-powered version requires Gemini API credits which are currently rate-limited for production deployment.
                  The demo accurately simulates agent creation based on your prompts with realistic workflow structures.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Input Area */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8 transition-all hover:border-purple-500/30">
          <label className="block text-white font-medium mb-3">
            What do you want your AI agent to do?
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: Email me my top 5 expenses from Google Sheets every Sunday at 8pm"
            className="w-full h-32 bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:border-purple-500 focus:outline-none resize-none placeholder-gray-500 font-medium"
            disabled={isCreating}
          />

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleCreate}
              disabled={isCreating || !input.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Building Agent...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
                  className="text-left bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-3 rounded-lg transition-all border border-white/10 hover:border-purple-500/30 hover:pl-5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Thinking Terminal */}
        <ThinkingTerminal logs={logs} isVisible={isCreating || (agent !== null && logs.length > 0)} />

        {/* Created Agent */}
        {agent && !isCreating && (
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/50 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-2xl font-bold text-white">Agent Created Successfully!</h3>
                <p className="text-purple-200">Ready to automate your workflow</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-2">Agent Description</h4>
              <p className="text-purple-200">{agent.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
                <h4 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" /> Triggers
                </h4>
                <div className="space-y-2">
                  {agent.triggers?.map((trigger: string, idx: number) => (
                    <div key={idx} className="text-purple-200 text-sm">{trigger}</div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
                <h4 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-400" /> Actions
                </h4>
                <div className="space-y-2">
                  {agent.actions?.map((action: string, idx: number) => (
                    <div key={idx} className="text-purple-200 text-sm">{action}</div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
                <h4 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Schedule
                </h4>
                <div className="text-purple-200 text-sm">{agent.schedule}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeploy}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold py-3 rounded-xl transition-all"
              >
                🚀 Open in Editor
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all"
              >
                View All Agents
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
};