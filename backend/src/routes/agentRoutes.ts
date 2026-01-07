import express from 'express';
import { 
  createAgent, 
  getAgents, 
  getAgent, 
  updateAgent, 
  deleteAgent,
  executeAgent,
  getAgentExecutions 
} from '../controllers/agentController';

const router = express.Router();

// Agent CRUD
router.post('/', createAgent);
router.get('/', getAgents);
router.get('/:id', getAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

// Agent Execution
router.post('/:id/execute', executeAgent);
router.post('/:id/run', executeAgent); // Alias
router.get('/:id/executions', getAgentExecutions);

export default router;