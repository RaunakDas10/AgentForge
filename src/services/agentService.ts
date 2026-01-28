import axios from 'axios';
import type { Agent as AgentType } from '../types/agent.types';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// Use environment variable for API URL with fallback
// const GEN_AI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = import.meta.env.PROD
  ? 'https://agentforge-backend.onrender.com/api'
  : 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Types - Use Type from agent.types.ts but allow local override if needed
export type Agent = AgentType;

// const genAI = GEN_AI_KEY ? new GoogleGenerativeAI(GEN_AI_KEY) : null;


export interface ExecutionResult {
  _id: string;
  startTime: string;
  status: 'completed' | 'failed' | 'running';
  duration: number;
  logs: any[];
  results: any[];
}

// --- Mock Implementation ---
const SIMULATE_DELAY = 800;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredAgents = (): any[] => {
  const stored = localStorage.getItem('mock_agents');
  return stored ? JSON.parse(stored) : [];
};

const saveStoredAgents = (agents: any[]) => {
  localStorage.setItem('mock_agents', JSON.stringify(agents));
};

const MockAgentService = {
  create: async (agentData: any) => {
    await delay(SIMULATE_DELAY);
    const agents = getStoredAgents();
    const newAgent = { ...agentData, _id: `agent_${Date.now()} `, createdAt: new Date().toISOString() };
    agents.push(newAgent);
    saveStoredAgents(agents);
    return newAgent;
  },

  getAll: async () => {
    await delay(SIMULATE_DELAY);
    return getStoredAgents();
  },

  getById: async (id: string) => {
    await delay(SIMULATE_DELAY);
    const agents = getStoredAgents();
    const agent = agents.find((a: any) => a._id === id || a.id === id);
    if (!agent) throw new Error('Agent not found');
    return agent;
  },

  update: async (id: string, agentData: any) => {
    await delay(SIMULATE_DELAY);
    const agents = getStoredAgents();
    const index = agents.findIndex((a: any) => a._id === id || a.id === id);
    if (index === -1) throw new Error('Agent not found');

    const updatedAgent = { ...agents[index], ...agentData, updatedAt: new Date().toISOString() };
    agents[index] = updatedAgent;
    saveStoredAgents(agents);
    return updatedAgent;
  },

  delete: async (id: string) => {
    await delay(SIMULATE_DELAY);
    const agents = getStoredAgents();
    const filtered = agents.filter((a: any) => a._id !== id && a.id !== id);
    saveStoredAgents(filtered);
    return { success: true };
  },

  execute: async (_id: string) => {
    await delay(2000);
    return {
      status: 'completed',
      output: 'Agent executed successfully. Checked 5 sources. No anomalies found.'
    };
  },

  getExecutions: async (_id: string) => {
    await delay(SIMULATE_DELAY);
    return [
      {
        _id: 'exec_1',
        startTime: new Date().toISOString(),
        status: 'completed',
        duration: 1200,
        logs: [
          { timestamp: new Date().toISOString(), level: 'info', message: 'Execution started' },
          { timestamp: new Date().toISOString(), level: 'info', message: 'Checking sources...' },
          { timestamp: new Date().toISOString(), level: 'success', message: 'Completed successfully' }
        ],
        results: [
          { nodeId: 'node_1', nodeType: 'trigger', nodeLabel: 'Schedule', result: { triggered: true }, timestamp: new Date().toISOString() }
        ]
      },

    ];
  },

  executeAdHoc: async (prompt: string) => {
    await delay(2000);
    return {
      status: 'success',
      data: {
        output: `< h1 > Mock Website < /h1><p>This is a mock response for prompt: ${prompt.substring(0, 30)}...</p >
  <style>body { font - family: sans - serif; padding: 20px; } </style>`
      }
    };
  },

  generate: async (prompt: string) => {
    await delay(2000);

    // Intelligent mock: Parse the prompt for keywords
    const lowerPrompt = prompt.toLowerCase();

    // Detect schedule/frequency
    let schedule = 'Real-time';
    let triggerType = 'webhookTrigger';
    let triggerLabel = 'Manual Trigger';

    if (lowerPrompt.includes('every') || lowerPrompt.includes('daily') || lowerPrompt.includes('weekly') || lowerPrompt.includes('minute')) {
      triggerType = 'scheduleTrigger';
      if (lowerPrompt.includes('5 minutes')) schedule = 'Every 5 minutes';
      else if (lowerPrompt.includes('hour')) schedule = 'Hourly';
      else if (lowerPrompt.includes('daily')) schedule = 'Daily';
      else if (lowerPrompt.includes('weekly')) schedule = 'Weekly';
      else if (lowerPrompt.includes('sunday')) schedule = 'Every Sunday';
      else schedule = 'Scheduled';
      triggerLabel = 'Schedule Trigger';
    }

    // Detect actions
    const actions = [];
    const nodes = [];
    const edges = [];
    let nodeId = 1;
    let yPos = 0;

    // Add trigger node
    nodes.push({
      id: String(nodeId),
      type: triggerType,
      position: { x: 100, y: yPos },
      data: { label: triggerLabel, type: 'trigger', schedule: schedule }
    });
    const triggerId = String(nodeId++);
    yPos += 150;

    // Detect specific actions
    if (lowerPrompt.includes('price') || lowerPrompt.includes('bitcoin') || lowerPrompt.includes('stock')) {
      nodes.push({
        id: String(nodeId),
        type: 'apiCall',
        position: { x: 100, y: yPos },
        data: { label: 'Fetch Price Data', type: 'action', url: 'https://api.coindesk.com/v1/bpi/currentprice.json' }
      });
      edges.push({ id: `e${triggerId}-${nodeId}`, source: triggerId, target: String(nodeId) });
      actions.push('Fetch Price Data');
      const lastNodeId = String(nodeId++);
      yPos += 150;

      if (lowerPrompt.includes('below') || lowerPrompt.includes('above') || lowerPrompt.includes('drop')) {
        nodes.push({
          id: String(nodeId),
          type: 'ifElse',
          position: { x: 100, y: yPos },
          data: { label: 'Check Threshold', type: 'condition', condition: 'price < 50000' }
        });
        edges.push({ id: `e${lastNodeId}-${nodeId}`, source: lastNodeId, target: String(nodeId) });
        actions.push('Condition Check');
        const conditionId = String(nodeId++);
        yPos += 150;

        if (lowerPrompt.includes('slack') || lowerPrompt.includes('alert') || lowerPrompt.includes('notify')) {
          nodes.push({
            id: String(nodeId),
            type: 'sendEmail',
            position: { x: 100, y: yPos },
            data: { label: 'Send Slack Alert', type: 'action', to: 'slack-webhook', subject: 'Price Alert' }
          });
          edges.push({ id: `e${conditionId}-${nodeId}`, source: conditionId, target: String(nodeId) });
          actions.push('Send Slack Alert');
          nodeId++;
        }
      }
    } else if (lowerPrompt.includes('email')) {
      nodes.push({
        id: String(nodeId),
        type: 'sendEmail',
        position: { x: 100, y: yPos },
        data: { label: 'Send Email', type: 'action', to: 'user@example.com', subject: 'Notification' }
      });
      edges.push({ id: `e${triggerId}-${nodeId}`, source: triggerId, target: String(nodeId) });
      actions.push('Send Email');
      nodeId++;
    } else {
      // Default: AI Process
      nodes.push({
        id: String(nodeId),
        type: 'aiProcess',
        position: { x: 100, y: yPos },
        data: { label: 'AI Process', type: 'action', prompt: prompt }
      });
      edges.push({ id: `e${triggerId}-${nodeId}`, source: triggerId, target: String(nodeId) });
      actions.push('AI Analysis');
      nodeId++;
    }

    // Generate name from prompt
    const name = prompt.split(' ').slice(0, 6).join(' ') + (prompt.split(' ').length > 6 ? '...' : '');

    return {
      status: 'success',
      data: {
        nodes,
        edges,
        triggers: [triggerLabel],
        actions,
        schedule,
        name,
        description: prompt
      }
    };
  }
};

// --- Real Implementation ---
const RealAgentService = {
  create: async (agentData: any) => {
    const response = await axios.post(`${API_URL}/agents`, agentData);
    return response.data;
  },

  getAll: async () => {
    const response = await axios.get(`${API_URL}/agents`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_URL}/agents/${id}`);
    return response.data;
  },

  update: async (id: string, agentData: any) => {
    const response = await axios.put(`${API_URL}/agents/${id}`, agentData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/agents/${id}`);
    return response.data;
  },

  execute: async (id: string) => {
    // Intercept default agents for client-side demo
    if (id === 'default_event_forge') {
      await new Promise(r => setTimeout(r, 1500));
      return {
        status: 'completed',
        logs: [
          { timestamp: new Date().toISOString(), level: 'info', message: 'Starting EventForge scheduler...' },
          { timestamp: new Date().toISOString(), level: 'info', message: 'Connecting to Calendar API...' },
          { timestamp: new Date().toISOString(), level: 'success', message: 'Found 3 available slots.' },
          { timestamp: new Date().toISOString(), level: 'success', message: 'Meeting scheduled successfully.' }
        ],
        results: []
      };
    }
    if (id === 'default_alert_kernel') {
      await new Promise(r => setTimeout(r, 1500));
      return {
        status: 'completed',
        logs: [
          { timestamp: new Date().toISOString(), level: 'info', message: 'Initializing ALERT KERNEL...' },
          { timestamp: new Date().toISOString(), level: 'info', message: 'Monitoring system metrics...' },
          { timestamp: new Date().toISOString(), level: 'warning', message: 'Threshold exceeded: CPU > 80%' },
          { timestamp: new Date().toISOString(), level: 'success', message: 'Alert notification sent.' }
        ],
        results: []
      };
    }

    const response = await axios.post(`${API_URL}/agents/${id}/execute`);
    return response.data;
  },

  getExecutions: async (id: string) => {
    const response = await axios.get(`${API_URL}/agents/${id}/executions`);
    return response.data;
  },

  executeAdHoc: async (prompt: string) => {
    const response = await axios.post(`${API_URL}/agents/execute-adhoc`, { prompt });
    return response.data;
  },

  generate: async (prompt: string) => {
    const response = await axios.post(`${API_URL}/agents/generate`, { prompt });
    return response.data;
  }
};

// Special configuration for agent generation
const USE_MOCK_GENERATION = import.meta.env.VITE_USE_MOCK_AGENT_GENERATION === 'true';

// Hybrid service: Use REAL for everything except generation (which can be mocked for demo)
const HybridAgentService = {
  ...RealAgentService,
  generate: USE_MOCK_GENERATION ? MockAgentService.generate : RealAgentService.generate
};

// Export based on configuration
export const agentService = USE_MOCK ? MockAgentService : HybridAgentService;

console.log(`Agent Service Initialized. Mode: ${USE_MOCK ? 'MOCK' : 'REAL'}`);
console.log(`Agent Generation: ${USE_MOCK_GENERATION ? 'MOCK (Demo Mode)' : 'REAL (AI Powered)'}`);

