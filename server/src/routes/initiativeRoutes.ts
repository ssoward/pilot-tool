import { Router } from 'express';
import { 
  getAllInitiatives, 
  getInitiativeById, 
  createInitiative, 
  updateInitiative, 
  deleteInitiative,
  syncWithJira,
  loadInitiativesFromJson
} from '../controllers/initiativeController';

const router = Router();

// Initiative CRUD routes
router.get('/', getAllInitiatives);
router.get('/:id', getInitiativeById);
router.post('/', createInitiative);
router.put('/:id', updateInitiative);
router.delete('/:id', deleteInitiative);

// Data management routes
router.post('/load-from-json', loadInitiativesFromJson);

// Jira integration route
router.post('/:id/sync-jira', syncWithJira);

export default router;
