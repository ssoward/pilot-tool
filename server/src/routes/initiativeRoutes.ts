import { Router } from 'express';
import { 
  getAllInitiatives, 
  getInitiativeById, 
  createInitiative, 
  updateInitiative, 
  deleteInitiative,
  syncWithJira
} from '../controllers/initiativeController';

const router = Router();

// Initiative CRUD routes
router.get('/', getAllInitiatives);
router.get('/:id', getInitiativeById);
router.post('/', createInitiative);
router.put('/:id', updateInitiative);
router.delete('/:id', deleteInitiative);

// Jira integration route
router.post('/:id/sync-jira', syncWithJira);

export default router;
