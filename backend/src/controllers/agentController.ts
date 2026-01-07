import { Request, Response } from 'express';
import Agent from '../models/Agent';
import Execution from '../models/Execution';
import { executeAgentWorkflow } from '../services/agentExecutor';
import { executeSmartAgent } from '../services/smartAgentExecutor';

const TEST_USER_ID = 'test-user-123';

export const createAgent = async (req: Request, res: Response) => {
  try {
    const agent = new Agent({
      userId: TEST_USER_ID,
      ...req.body
    });
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
};

export const getAgents = async (req: Request, res: Response) => {
  try {
    const agents = await Agent.find({ userId: TEST_USER_ID }).sort({ updatedAt: -1 });
    res.json(agents);
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
    
    const agent = await Agent.findOne({ _id: agentId, userId: TEST_USER_ID });
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    console.log(`🚀 Starting execution for agent: ${agent.name}`);

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

    res.json({
      message: 'Agent execution started',
      agentId,
      agentName: agent.name,
      mode: agent.description && agent.description.length > 20 ? 'smart-ai' : 'workflow',
      status: 'running'
    });

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