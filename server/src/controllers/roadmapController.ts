import { Request, Response } from 'express';
import RoadmapItem from '../models/RoadmapItem';
import RoadmapMilestone from '../models/RoadmapMilestone';
import Initiative from '../models/Initiative';
import TeamAssignment from '../models/TeamAssignment';
import { Op } from 'sequelize';
import { detectResourceConflicts } from './teamController';

// Roadmap CRUD operations
export const getRoadmapItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      teamIds, 
      status, 
      priority, 
      startDate, 
      endDate 
    } = req.query;
    
    const filters: any = {};
    
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filters.status = { [Op.in]: statusArray };
    }
    
    if (priority) {
      const priorityArray = Array.isArray(priority) ? priority : [priority];
      filters.priority = { [Op.in]: priorityArray };
    }
    
    if (startDate) {
      filters.startDate = { [Op.gte]: new Date(startDate as string) };
    }
    
    if (endDate) {
      filters.endDate = { [Op.lte]: new Date(endDate as string) };
    }
    
    const items = await RoadmapItem.findAll({
      where: filters,
      include: [
        { model: RoadmapMilestone, as: 'milestones' },
        { model: Initiative, as: 'initiative' }
      ],
      order: [
        ['startDate', 'ASC']
      ]
    });
    
    // Filter by team if teamIds are provided
    if (teamIds) {
      const teamIdArray = Array.isArray(teamIds) ? teamIds : [teamIds];
      
      const filteredItems = [];
      
      for (const item of items) {
        const assignments = await TeamAssignment.findAll({
          where: {
            initiativeId: item.initiativeId,
            teamId: { [Op.in]: teamIdArray }
          }
        });
        
        if (assignments.length > 0) {
          filteredItems.push(item);
        }
      }
      
      res.status(200).json(filteredItems);
      return;
    }
    
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch roadmap items', error });
  }
};

export const getRoadmapItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await RoadmapItem.findByPk(id, {
      include: [
        { model: RoadmapMilestone, as: 'milestones' },
        { model: Initiative, as: 'initiative' }
      ]
    });
    
    if (!item) {
      res.status(404).json({ message: 'Roadmap item not found' });
      return;
    }
    
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch roadmap item', error });
  }
};

export const createRoadmapItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { initiativeId } = req.body;
    
    // Check if initiative exists
    const initiative = await Initiative.findByPk(initiativeId);
    if (!initiative) {
      res.status(404).json({ message: 'Initiative not found' });
      return;
    }
    
    // Check if roadmap item already exists for this initiative
    const existingItem = await RoadmapItem.findOne({
      where: { initiativeId }
    });
    
    if (existingItem) {
      res.status(400).json({ 
        message: 'A roadmap item already exists for this initiative',
        existingItem
      });
      return;
    }
    
    // Create the roadmap item
    const roadmapItem = await RoadmapItem.create({
      ...req.body,
      initiativeName: initiative.name
    });
    
    res.status(201).json(roadmapItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create roadmap item', error });
  }
};

export const updateRoadmapItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [updated] = await RoadmapItem.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      res.status(404).json({ message: 'Roadmap item not found' });
      return;
    }
    
    const updatedItem = await RoadmapItem.findByPk(id, {
      include: [{ model: RoadmapMilestone, as: 'milestones' }]
    });
    
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update roadmap item', error });
  }
};

export const deleteRoadmapItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await RoadmapItem.destroy({
      where: { id }
    });
    
    if (!deleted) {
      res.status(404).json({ message: 'Roadmap item not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete roadmap item', error });
  }
};

// Timeline Management
export const updateItemTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { startDate, endDate, validateResources } = req.body;
    
    const roadmapItem = await RoadmapItem.findByPk(id);
    if (!roadmapItem) {
      res.status(404).json({ message: 'Roadmap item not found' });
      return;
    }
    
    // Update the timeline
    await roadmapItem.update({
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });
    
    // Check for conflicts if requested
    let conflicts: any[] = [];
    if (validateResources) {
      // Get all teams assigned to this initiative
      const assignments = await TeamAssignment.findAll({
        where: { initiativeId: roadmapItem.initiativeId }
      });
      
      // Update assignments to match the new timeline
      for (const assignment of assignments) {
        await assignment.update({
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        });
        
        // Detect conflicts for each team
        const teamConflicts = await detectResourceConflicts(
          assignment.teamId, 
          new Date(startDate), 
          new Date(endDate)
        );
        
        conflicts = [...conflicts, ...teamConflicts];
      }
    }
    
    res.status(200).json({
      success: true,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
      updatedItem: roadmapItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update timeline', error });
  }
};

export const bulkUpdateTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const { updates } = req.body;
    const results = {
      successful: [] as string[],
      failed: [] as { itemId: string; error: string }[]
    };
    
    for (const update of updates) {
      try {
        const { itemId, startDate, endDate } = update;
        const roadmapItem = await RoadmapItem.findByPk(itemId);
        
        if (!roadmapItem) {
          results.failed.push({
            itemId,
            error: 'Roadmap item not found'
          });
          continue;
        }
        
        await roadmapItem.update({
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        });
        
        results.successful.push(itemId);
      } catch (error) {
        results.failed.push({
          itemId: update.itemId,
          error: 'Failed to update timeline'
        });
      }
    }
    
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to perform bulk timeline update', error });
  }
};

// Milestone Management
export const createRoadmapMilestone = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roadmapItemId } = req.body;
    
    // Check if roadmap item exists
    const roadmapItem = await RoadmapItem.findByPk(roadmapItemId);
    if (!roadmapItem) {
      res.status(404).json({ message: 'Roadmap item not found' });
      return;
    }
    
    const milestone = await RoadmapMilestone.create(req.body);
    res.status(201).json(milestone);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create roadmap milestone', error });
  }
};

export const updateRoadmapMilestone = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [updated] = await RoadmapMilestone.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      res.status(404).json({ message: 'Roadmap milestone not found' });
      return;
    }
    
    const updatedMilestone = await RoadmapMilestone.findByPk(id);
    res.status(200).json(updatedMilestone);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update roadmap milestone', error });
  }
};

export const deleteRoadmapMilestone = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await RoadmapMilestone.destroy({
      where: { id }
    });
    
    if (!deleted) {
      res.status(404).json({ message: 'Roadmap milestone not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete roadmap milestone', error });
  }
};

// Timeline Analysis
export const getTimelineAnalysis = async (req: Request, res: Response) => {
  try {
    const { 
      teamIds, 
      startDate = new Date(), 
      endDate
    } = req.query;
    
    // Get all roadmap items
    const filters: any = {};
    
    if (startDate) {
      filters.startDate = { [Op.gte]: new Date(startDate as string) };
    }
    
    if (endDate) {
      filters.endDate = { [Op.lte]: new Date(endDate as string) };
    }
    
    let roadmapItems = await RoadmapItem.findAll({
      where: filters,
      include: [
        { model: RoadmapMilestone, as: 'milestones' },
        { model: Initiative, as: 'initiative' }
      ]
    });
    
    // Filter by team if teamIds are provided
    if (teamIds) {
      const teamIdArray = Array.isArray(teamIds) ? teamIds : [teamIds];
      
      const filteredItems = [];
      
      for (const item of roadmapItems) {
        const assignments = await TeamAssignment.findAll({
          where: {
            initiativeId: item.initiativeId,
            teamId: { [Op.in]: teamIdArray }
          }
        });
        
        if (assignments.length > 0) {
          filteredItems.push(item);
        }
      }
      
      roadmapItems = filteredItems;
    }
    
    // Basic analysis
    const totalInitiatives = roadmapItems.length;
    const completedInitiatives = roadmapItems.filter(item => item.status === 'completed').length;
    const inProgressInitiatives = roadmapItems.filter(item => item.status === 'in_progress').length;
    const plannedInitiatives = roadmapItems.filter(item => item.status === 'planned').length;
    const overallProgress = totalInitiatives > 0 ? (completedInitiatives / totalInitiatives) * 100 : 0;
    
    // Identify critical path (simple algorithm - most dependencies)
    const orderedByDependencies = [...roadmapItems].sort((a, b) => 
      (b.dependencies?.length || 0) - (a.dependencies?.length || 0)
    );
    
    const criticalPath = orderedByDependencies.slice(0, 5); // Top 5 most depended-on items
    
    // Identify risky items
    const riskyItems = roadmapItems
      .map(item => {
        const riskFactors = [];
        
        // Check for tight timeline
        const durationMs = new Date(item.endDate).getTime() - new Date(item.startDate).getTime();
        const durationDays = durationMs / (1000 * 60 * 60 * 24);
        if (durationDays < 14 && item.estimatedEffort > 50) {
          riskFactors.push('tight_timeline');
        }
        
        // Check for high dependencies
        if ((item.dependencies?.length || 0) > 3) {
          riskFactors.push('high_dependencies');
        }
        
        // Determine impact
        let impact: 'high' | 'medium' | 'low' = 'low';
        if (riskFactors.length > 1) {
          impact = 'high';
        } else if (riskFactors.length > 0) {
          impact = 'medium';
        }
        
        return {
          item,
          riskFactors,
          impact
        };
      })
      .filter(item => item.riskFactors.length > 0);
    
    const analysis = {
      totalInitiatives,
      completedInitiatives,
      inProgressInitiatives,
      plannedInitiatives,
      overallProgress,
      criticalPath,
      riskyItems
    };
    
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Failed to analyze timeline', error });
  }
};

export const getCapacityProjection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, teamIds } = req.query;
    
    if (!startDate || !endDate) {
      res.status(400).json({ message: 'Start date and end date are required' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    // Parse team IDs if provided
    const teamIdArray = teamIds ? (teamIds as string).split(',') : [];
    
    // Generate mock capacity projection data
    // In a real implementation, this would calculate actual team capacities and allocations
    const timeline = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const weekDate = currentDate.toISOString().split('T')[0];
      
      timeline.push({
        date: weekDate,
        totalCapacity: 100,
        allocatedCapacity: Math.floor(Math.random() * 80) + 20,
        availableCapacity: Math.floor(Math.random() * 50) + 10,
        utilizationRate: Math.random() * 0.8 + 0.2,
        teams: [
          {
            teamId: '1',
            teamName: 'Frontend Team',
            capacity: 40,
            allocated: Math.floor(Math.random() * 35) + 5,
            utilization: Math.random() * 0.9 + 0.1
          },
          {
            teamId: '2', 
            teamName: 'Backend Team',
            capacity: 35,
            allocated: Math.floor(Math.random() * 30) + 5,
            utilization: Math.random() * 0.85 + 0.15
          },
          {
            teamId: '3',
            teamName: 'DevOps Team', 
            capacity: 25,
            allocated: Math.floor(Math.random() * 20) + 5,
            utilization: Math.random() * 0.8 + 0.2
          }
        ]
      });
      
      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    const recommendations = [
      {
        type: 'rebalance' as const,
        description: 'Consider redistributing work from Frontend Team to Backend Team for better balance',
        impact: 'Could improve overall delivery timeline by 15%',
        confidence: 0.78
      },
      {
        type: 'additional_resources' as const,
        description: 'DevOps team may need additional resources for infrastructure scaling',
        impact: 'Prevents potential bottlenecks in deployment pipeline',
        confidence: 0.65
      }
    ];
    
    const projection = {
      timeline,
      recommendations
    };
    
    res.status(200).json(projection);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get capacity projection', error });
  }
};
