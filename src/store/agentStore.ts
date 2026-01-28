import { create } from 'zustand';
import { agentService } from '../services/agentService';
import type { Agent } from '../types/agent.types';

interface AgentState {
  agents: Agent[];
  currentAgent: Agent | null;
  loading: boolean;

  loadAgents: () => Promise<void>;
  getAgentById: (id: string) => Agent | null;
  saveAgent: (agent: Agent) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  setCurrentAgent: (agent: Agent | null) => void;
  createNewAgent: () => Agent;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [
    {
      id: 'default_event_forge',
      name: 'EventForge',
      description: 'Automatically schedule meetings based on calendar availability.',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 'default_alert_kernel',
      name: 'ALERT KERNEL',
      description: 'Monitor conditions and send instant notifications.',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    }
  ],
  currentAgent: null,
  loading: false,

  loadAgents: async () => {
    try {
      set({ loading: true });

      // Load from localStorage first
      const stored = localStorage.getItem('agents_store') || '[]';
      const localAgents = JSON.parse(stored);

      // Try to load from backend as well
      try {
        const backendAgents = await agentService.getAll();
        const combined = [...localAgents, ...backendAgents.map((a: any) => ({ ...a, id: a._id }))];
        // Deduplicate by ID
        const uniqueAgents = Array.from(new Map(combined.map(a => [a.id, a])).values());
        set({ agents: uniqueAgents, loading: false });
      } catch (backendError) {
        console.warn('Backend load failed, using localStorage only:', backendError);
        set({ agents: localAgents, loading: false });
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
      set({ loading: false });
    }
  },

  saveAgent: async (agent) => {
    try {
      // For demo mode, use localStorage as primary storage
      const stored = localStorage.getItem('agents_store') || '[]';
      const localAgents = JSON.parse(stored);

      const agentToSave = { ...agent, id: agent.id || agent._id || `agent_${Date.now()}` };

      // Update or add to localStorage
      const existingIndex = localAgents.findIndex((a: any) => a.id === agentToSave.id || a._id === agentToSave.id);
      if (existingIndex >= 0) {
        localAgents[existingIndex] = agentToSave;
      } else {
        localAgents.push(agentToSave);
      }
      localStorage.setItem('agents_store', JSON.stringify(localAgents));

      // Update store immediately
      set({ agents: [...get().agents.filter(a => a.id !== agentToSave.id), agentToSave] });

      // Try backend as backup (but don't fail if it errors)
      try {
        if (agent._id) {
          await agentService.update(agent._id, agent);
        } else {
          await agentService.create(agent);
        }
      } catch (backendError) {
        console.warn('Backend save failed, using localStorage only:', backendError);
      }
    } catch (error) {
      console.error('Failed to save agent:', error);
      throw error;
    }
  },

  deleteAgent: async (id) => {
    try {
      await agentService.delete(id);
      set({ agents: get().agents.filter(a => a.id !== id) });
    } catch (error) {
      console.error('Failed to delete agent:', error);
      throw error;
    }
  },

  getAgentById: (id) => {
    const agents = get().agents;
    return agents.find(a => a.id === id || a._id === id) || null;
  },

  setCurrentAgent: (agent) => set({ currentAgent: agent }),

  createNewAgent: () => {
    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name: 'Untitled Agent',
      description: '',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    return newAgent;
  }
}));