import { Request, Response } from 'express';
import Team from '../models/Team';
import TeamMember from '../models/TeamMember';
import TeamAssignment from '../models/TeamAssignment';
import Initiative from '../models/Initiative';
import ResourceConflict from '../models/ResourceConflict';
import { Op } from 'sequelize';

// Team CRUD operations
export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create team', error });
  }
};

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await Team.findAll();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teams', error });
  }
};

export const getTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id, {
      include: [
        { model: TeamMember, as: 'members' },
        { 
          model: TeamAssignment, 
          as: 'assignments',
          include: [{ model: Initiative, as: 'initiative' }]
        }
      ]
    });
    
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team', error });
  }
};

export const updateTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [updated] = await Team.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    
    const updatedTeam = await Team.findByPk(id);
    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update team', error });
  }
};

export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Team.destroy({
      where: { id }
    });
    
    if (!deleted) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete team', error });
  }
};

// Team Member operations
export const addTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const teamMember = await TeamMember.create(req.body);
    
    // Update team member count
    const team = await Team.findByPk(teamMember.teamId);
    if (team) {
      await team.update({ 
        memberCount: team.memberCount + 1,
        capacity: team.capacity + teamMember.capacity
      });
    }
    
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add team member', error });
  }
};

export const getTeamMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const members = await TeamMember.findAll({
      where: { teamId }
    });
    
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team members', error });
  }
};

export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findByPk(id);
    
    if (!teamMember) {
      res.status(404).json({ message: 'Team member not found' });
      return;
    }
    
    // If capacity is changing, update team capacity
    if (req.body.capacity && req.body.capacity !== teamMember.capacity) {
      const capacityDifference = req.body.capacity - teamMember.capacity;
      const team = await Team.findByPk(teamMember.teamId);
      
      if (team) {
        await team.update({
          capacity: team.capacity + capacityDifference
        });
      }
    }
    
    await teamMember.update(req.body);
    res.status(200).json(teamMember);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update team member', error });
  }
};

export const removeTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMember.findByPk(id);
    
    if (!teamMember) {
      res.status(404).json({ message: 'Team member not found' });
      return;
    }
    
    // Update team capacity and member count
    const team = await Team.findByPk(teamMember.teamId);
    if (team) {
      await team.update({
        capacity: team.capacity - teamMember.capacity,
        memberCount: team.memberCount - 1
      });
    }
    
    await teamMember.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove team member', error });
  }
};

// Team Assignment operations
export const assignInitiativeToTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { initiativeId } = req.params;
    const { teamId, allocatedCapacity, startDate, endDate, role } = req.body;
    
    // Check if initiative exists
    const initiative = await Initiative.findByPk(initiativeId);
    if (!initiative) {
      res.status(404).json({ message: 'Initiative not found' });
      return;
    }
    
    // Check if team exists
    const team = await Team.findByPk(teamId);
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    
    // Check for existing assignment
    const existingAssignment = await TeamAssignment.findOne({
      where: { initiativeId, teamId }
    });
    
    if (existingAssignment) {
      res.status(400).json({ message: 'Team is already assigned to this initiative' });
      return;
    }
    
    // Create the assignment
    const assignment = await TeamAssignment.create({
      initiativeId,
      teamId,
      allocatedCapacity,
      startDate,
      endDate,
      role
    });
    
    // Update team workload
    await team.update({
      currentWorkload: team.currentWorkload + allocatedCapacity
    });
    
    // Detect potential resource conflicts
    await detectResourceConflicts(teamId, startDate, endDate);
    
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign initiative to team', error });
  }
};

export const unassignInitiativeFromTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { initiativeId, teamId } = req.params;
    
    const assignment = await TeamAssignment.findOne({
      where: { initiativeId, teamId }
    });
    
    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    
    // Update team workload
    const team = await Team.findByPk(teamId);
    if (team) {
      await team.update({
        currentWorkload: Math.max(0, team.currentWorkload - assignment.allocatedCapacity)
      });
    }
    
    await assignment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to unassign initiative from team', error });
  }
};

export const getResourceAllocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await Team.findAll({
      include: [
        { 
          model: TeamAssignment, 
          as: 'assignments',
          include: [{ model: Initiative, as: 'initiative' }]
        }
      ]
    });
    
    const resourceAllocation = teams.map(team => {
      const totalCapacity = team.capacity;
      const allocatedCapacity = team.currentWorkload;
      const availableCapacity = Math.max(0, totalCapacity - allocatedCapacity);
      const utilizationPercentage = totalCapacity > 0 ? (allocatedCapacity / totalCapacity) * 100 : 0;
      
      return {
        teamId: team.id,
        teamName: team.name,
        totalCapacity,
        allocatedCapacity,
        availableCapacity,
        utilizationPercentage,
        assignments: team.assignments || []
      };
    });
    
    res.status(200).json(resourceAllocation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get resource allocation', error });
  }
};

export const detectResourceConflicts = async (
  teamId: string, 
  startDate: Date = new Date(), 
  endDate?: Date
): Promise<ResourceConflict[]> => {
  try {
    const conflicts: ResourceConflict[] = [];
    const team = await Team.findByPk(teamId, {
      include: [
        { model: TeamAssignment, as: 'assignments' }
      ]
    });
    
    if (!team) {
      return conflicts;
    }
    
    // Check for overallocation
    if (team.currentWorkload > team.capacity) {
      const overallocatedAmount = team.currentWorkload - team.capacity;
      const overallocationPercentage = Math.round((overallocatedAmount / team.capacity) * 100);
      
      const severity = overallocationPercentage > 20 ? 'high' : 
                      overallocationPercentage > 10 ? 'medium' : 'low';
      
      const initiativeIds = (team.assignments || []).map(a => a.initiativeId);
      
      await ResourceConflict.create({
        type: 'overallocation',
        severity,
        description: `Team ${team.name} is overallocated by ${overallocationPercentage}% (${overallocatedAmount} capacity units)`,
        affectedTeams: [team.id],
        affectedInitiatives: initiativeIds,
        suggestedResolution: 'Reduce allocation or extend timelines for some initiatives',
        detectedAt: new Date()
      });
    }
    
    // Implementation of additional conflict detection would go here
    // - Skill gap detection
    // - Timeline conflicts
    
    return conflicts;
  } catch (error) {
    console.error('Error detecting resource conflicts:', error);
    return [];
  }
};

export const getResourceConflicts = async (req: Request, res: Response): Promise<void> => {
  try {
    const conflicts = await ResourceConflict.findAll({
      order: [['detectedAt', 'DESC']]
    });
    
    res.status(200).json(conflicts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get resource conflicts', error });
  }
};
