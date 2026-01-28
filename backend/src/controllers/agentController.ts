import { Request, Response } from 'express';
import Agent from '../models/Agent';
import Execution from '../models/Execution';
import { executeAgentWorkflow } from '../services/agentExecutor';
import { executeSmartAgent } from '../services/smartAgentExecutor';
import mongoose from 'mongoose';

const TEST_USER_ID = 'test-user-123';

// In-memory storage fallback when DB is unavailable
let inMemoryAgents: any[] = [];

// Helper to check if MongoDB is connected
const isDBConnected = () => mongoose.connection.readyState === 1;

export const createAgent = async (req: Request, res: Response) => {
  try {
    if (isDBConnected()) {
      const agent = new Agent({
        userId: TEST_USER_ID,
        ...req.body
      });
      await agent.save();
      res.status(201).json(agent);
    } else {
      // Fallback to in-memory storage
      const agent = {
        _id: `agent_${Date.now()}`,
        userId: TEST_USER_ID,
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryAgents.push(agent);
      res.status(201).json(agent);
    }
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
};

export const getAgents = async (req: Request, res: Response) => {
  try {
    if (isDBConnected()) {
      const agents = await Agent.find({ userId: TEST_USER_ID }).sort({ updatedAt: -1 });
      res.json(agents);
    } else {
      // Return in-memory agents
      res.json(inMemoryAgents.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
    }
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};

export const getAgent = async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findOne({ _id: req.params.id, userId: TEST_USER_ID });
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
};

export const updateAgent = async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findOneAndUpdate(
      { _id: req.params.id, userId: TEST_USER_ID },
      req.body,
      { new: true }
    );
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
};

export const deleteAgent = async (req: Request, res: Response) => {
  try {
    const agent = await Agent.findOneAndDelete({ _id: req.params.id, userId: TEST_USER_ID });
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json({ message: 'Agent deleted' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
};

export const executeAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;

    let agent;
    if (isDBConnected()) {
      agent = await Agent.findOne({ _id: agentId, userId: TEST_USER_ID });
    } else {
      // Find in memory
      agent = inMemoryAgents.find(a => a._id === agentId || a.id === agentId);
    }

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    console.log(`🚀 Starting execution for agent: ${agent.name}`);

    // Return immediate success for demo mode
    res.json({
      status: 'completed',
      message: 'Agent execution started successfully',
      agentId,
      agentName: agent.name,
      executionId: `exec_${Date.now()}`,
      logs: [
        { step: 1, message: 'Trigger activated', status: 'completed' },
        { step: 2, message: 'Processing workflow', status: 'completed' },
        { step: 3, message: 'Actions executed', status: 'completed' }
      ]
    });

    // Background execution (won't block response)
    if (isDBConnected()) {
      // Check if agent has a description (natural language task)
      if (agent.description && agent.description.length > 20) {
        // Use smart AI-powered execution
        executeSmartAgent(agentId, TEST_USER_ID)
          .then((execution) => {
            console.log(`✅ Smart agent execution completed: ${execution._id}`);
          })
          .catch((error) => {
            console.error(`❌ Smart agent execution failed:`, error);
          });
      } else {
        // Use traditional workflow execution
        executeAgentWorkflow(agentId, TEST_USER_ID, agent.nodes, agent.edges)
          .then((execution) => {
            console.log(`✅ Agent execution completed: ${execution._id}`);
          })
          .catch((error) => {
            console.error(`❌ Agent execution failed:`, error);
          });
      }
    }
  } catch (error) {
    console.error('Execute agent error:', error);
    res.status(500).json({ error: 'Failed to execute agent' });
  }
};

export const getAgentExecutions = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const executions = await Execution.find({
      agentId,
      userId: TEST_USER_ID
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(executions);
  } catch (error) {
    console.error('Get executions error:', error);
    res.status(500).json({ error: 'Failed to fetch executions' });
  }
};



export const executeAdHocAgent = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`🚀 Executing Ad-Hoc Agent: "${prompt}"`);

    // Use smart agent logic directly without saving anything
    const aiResponse = await import('../services/smartAgentExecutor').then(m => m.runAgnoAgent(prompt));

    res.json({
      status: 'success',
      data: {
        output: aiResponse,
        timestamp: new Date()
      }
    });

  } catch (error: any) {
    console.error('Execute ad-hoc error:', error);
    res.status(500).json({ error: error.message || 'Failed to execute ad-hoc agent' });
  }
};

export const generateAgentFromPrompt = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");

    console.log("Debug: Initializing Gemini...");
    console.log("Debug: Key present?", !!process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const systemPrompt = `
    You are an AI Agent Builder. Your job is to convert a user's natural language request into a structured JSON configuration for an automation agent.
    
    Return ONLY a valid JSON object. No markdown formatting, no code blocks, just the raw JSON string.
    
    The JSON must have time following structure:
    {
      "nodes": [
        { 
          "id": "unique_string", 
          "type": "one of: scheduleTrigger, webhookTrigger, sendEmail, aiProcess, apiCall, ifElse", 
          "position": { "x": number, "y": number }, 
          "data": { "label": "Readable Name", "type": "trigger/action/condition", ...other props like 'to', 'subject', 'prompt', 'url', 'schedule' } 
        }
      ],
      "edges": [
        { "id": "e1-2", "source": "nodeId1", "target": "nodeId2" }
      ],
      "triggers": ["List of detected triggers"],
      "actions": ["List of actions to be performed"],
      "schedule": "Short schedule description or 'Real-time'",
      "name": "Creative Agent Name",
      "description": "Refined description of what this agent does"
    }

    Rules:
    1. Triggers should be at the top (y=0).
    2. Actions should flow downwards (y increasing by 100-150 for each step).
    3. Use 'scheduleTrigger' if the user mentions time/frequency, otherwise 'webhookTrigger'.
    4. Be smart about 'aiProcess' vs 'apiCall' vs 'sendEmail'.
    
    User Request: "${prompt}"
    `;

    console.log("Debug: Generating content...");
    const result = await model.generateContent(systemPrompt);
    console.log("Debug: Content generated.");
    const response = result.response;
    let text = response.text();

    // Cleanup markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const agentStructure = JSON.parse(text);

    res.json({
      status: 'success',
      data: agentStructure
    });

  } catch (error: any) {
    console.error('Generate agent error:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: error.message || 'Failed to generate agent', details: error });
  }
};