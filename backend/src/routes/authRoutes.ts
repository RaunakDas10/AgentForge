import express from 'express';
// import { auth } from '../middleware/auth'; // Temporarily disabled
import { createAgent, getAgents, getAgent, updateAgent, deleteAgent } from '../controllers/agentController';

const router = express.Router();

// Temporarily removed auth middleware for testing
router.post('/', createAgent);
router.get('/', getAgents);
router.get('/:id', getAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

export default router;