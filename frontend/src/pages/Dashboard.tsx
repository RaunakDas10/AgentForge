import React, { useEffect, useState } from 'react';
import { Plus, Sparkles, Zap, Activity } from 'lucide-react';
import { AgentCard } from '../components/dashboard/AgentCard';
import { useAgentStore } from '../store/agentStore';
import { agentService } from '../services/agentService';
import { ExecutionViewer } from '../components/ExecutionViewer';

interface DashboardProps {
  onCreateNew: () => void;
  onCreateWithAI: () => void;
  onEditAgent: (agentId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onCreateWithAI, onEditAgent }) => {
  const { agents, loadAgents, deleteAgent } = useAgentStore();
  const [executingAgents, setExecutingAgents] = useState<Set<string>>(new Set());
  const [viewingExecution, setViewingExecution] = useState<{ agentId: string; agentName: string } | null>(null);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      try {
        await deleteAgent(id);
        alert('✅ Agent deleted!');
      } catch (error) {
        alert('❌ Failed to delete agent');
      }
    }
  };

  const handleRun = async (agentId: string, agentName: string) => {
    try {
      setExecutingAgents(prev => new Set(prev).add(agentId));
      
      console.log('🚀 Executing agent from dashboard:', agentId);
      const result = await agentService.execute(agentId);
      
      console.log('✅ Execution started:', result);
      alert(`🚀 Agent "${agentName}" is now running!\n\nStatus: ${result.status}\n\nCheck the console for execution logs.`);
      
    } catch (error: any) {
      console.error('❌ Execution error:', error);
      alert(`❌ Failed to execute agent!\n\nError: ${error.response?.data?.error || error.message}`);
    } finally {
      setExecutingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Execution Viewer Modal */}
      {viewingExecution && (
        <ExecutionViewer
          agentId={viewingExecution.agentId}
          agentName={viewingExecution.agentName}
          onClose={() => setViewingExecution(null)}
        />
      )}

      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Agents</h1>
                <p className="text-gray-400">Manage and monitor your AI agents</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCreateWithAI}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create with AI ✨
              </button>
              <button
                onClick={onCreateNew}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {agents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-12 h-12 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No agents yet</h2>
            <p className="text-gray-400 mb-6">Create your first AI agent to get started!</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onCreateWithAI}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create with AI ✨
              </button>
              <button
                onClick={onCreateNew}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Agent
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-400">
              {agents.length} agent{agents.length !== 1 ? 's' : ''} found
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onEdit={() => onEditAgent(agent.id)}
                  onDelete={() => handleDelete(agent.id)}
                  onRun={() => handleRun(agent.id, agent.name)}
                  onViewResults={() => setViewingExecution({ agentId: agent.id, agentName: agent.name })}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};