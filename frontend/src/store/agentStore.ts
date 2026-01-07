import { create } from 'zustand';
import { agentService } from '../services/agentService';

type NodeType = 'trigger' | 'action' | 'condition' | 'data';

interface NodeData {
  label: string;
  type: NodeType;
  config?: { [key: string]: any };
  description?: string;
}

interface AgentNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

interface AgentEdge {
  id: string;
  source: string;
  target: string;
}

interface Agent {
  _id?: string;
  id: string;
  name: string;
  description: string;
  nodes: AgentNode[];
  edges: AgentEdge[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'paused';
}

interface AgentState {
  agents: Agent[];
  currentAgent: Agent | null;
  loading: boolean;
  
  loadAgents: () => Promise<void>;
  saveAgent: (agent: Agent) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  setCurrentAgent: (agent: Agent | null) => void;
  createNewAgent: () => Agent;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  currentAgent: null,
  loading: false,
  
  loadAgents: async () => {
    try {
      set({ loading: true });
      const agents = await agentService.getAll();
      set({ agents: agents.map((a: any) => ({ ...a, id: a._id })), loading: false });
    } catch (error) {
      console.error('Failed to load agents:', error);
      set({ loading: false });
    }
  },
  
  saveAgent: async (agent) => {
    try {
      if (agent._id) {
        // Update existing
        const updated = await agentService.update(agent._id, agent);
        const agents = get().agents.map(a => a.id === agent.id ? { ...updated, id: updated._id } : a);
        set({ agents });
      } else {
        // Create new
        const created = await agentService.create(agent);
        set({ agents: [...get().agents, { ...created, id: created._id }] });
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