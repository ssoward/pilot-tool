import { Router } from 'express';
import {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  removeTeamMember,
  assignInitiativeToTeam,
  unassignInitiativeFromTeam,
  getResourceAllocation,
  getResourceConflicts
} from '../controllers/teamController';

const router = Router();

// Team CRUD routes
router.post('/teams', createTeam);
router.get('/teams', getTeams);
router.get('/teams/:id', getTeam);
router.put('/teams/:id', updateTeam);
router.delete('/teams/:id', deleteTeam);

// Team Member routes
router.post('/team-members', addTeamMember);
router.get('/teams/:teamId/members', getTeamMembers);
router.put('/team-members/:id', updateTeamMember);
router.delete('/team-members/:id', removeTeamMember);

// Team Assignment routes
router.post('/initiatives/:initiativeId/assign', assignInitiativeToTeam);
router.delete('/initiatives/:initiativeId/unassign/:teamId', unassignInitiativeFromTeam);

// Resource Planning routes
router.get('/resources/allocation', getResourceAllocation);
router.get('/resources/conflicts', getResourceConflicts);

export default router;
