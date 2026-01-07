import api from './api';

export const agentService = {
  // Create agent
  create: async (agentData: any) => {
    const response = await api.post('/agents', agentData);
    return response.data;
  },

  // Get all agents
  getAll: async () => {
    const response = await api.get('/agents');
    return response.data;
  },

  // Get single agent
  getById: async (id: string) => {
    const response = await api.get(`/agents/${id}`);
    return response.data;
  },

  // Update agent
  update: async (id: string, agentData: any) => {
    const response = await api.put(`/agents/${id}`, agentData);
    return response.data;
  },

  // Delete agent
  delete: async (id: string) => {
    const response = await api.delete(`/agents/${id}`);
    return response.data;
  },

  // Execute agent
  execute: async (id: string) => {
    const response = await api.post(`/agents/${id}/execute`);
    return response.data;
  },

  // Get execution history
  getExecutions: async (id: string) => {
    const response = await api.get(`/agents/${id}/executions`);
    return response.data;
  },
};