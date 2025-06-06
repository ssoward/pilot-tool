import { Request, Response, NextFunction } from 'express';
import Initiative from '../models/Initiative';
import { ValidationError } from 'sequelize';
import fs from 'fs';
import path from 'path';

export const getAllInitiatives = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const initiatives = await Initiative.findAll();
    res.status(200).json(initiatives);
  } catch (error) {
    next(error);
  }
};

export const getInitiativeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const initiative = await Initiative.findByPk(id);
    
    if (!initiative) {
      res.status(404).json({ error: 'Initiative not found' });
      return;
    }
    
    res.status(200).json(initiative);
  } catch (error) {
    next(error);
  }
};

export const createInitiative = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate required fields for the new schema
    const requiredFields = ['summary', 'productGroupName', 'teamName'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
      return;
    }

    // Set default values for complex fields if not provided
    if (!req.body.workingGroup) {
      req.body.workingGroup = {
        name: '',
        lead: '',
        members: []
      };
    }
    
    if (!req.body.opportunityScore) {
      req.body.opportunityScore = {
        totalScore: 0,
        confidence: 'Low',
        breakdown: {}
      };
    }
    
    if (!req.body.hypothesis) {
      req.body.hypothesis = {
        statement: '',
        assumptions: [],
        risks: [],
        successMetrics: []
      };
    }

    const initiative = await Initiative.create(req.body);
    res.status(201).json(initiative);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const updateInitiative = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const [updated] = await Initiative.update(req.body, {
      where: { id }
    });
    
    if (updated === 0) {
      res.status(404).json({ error: 'Initiative not found' });
      return;
    }
    
    const updatedInitiative = await Initiative.findByPk(id);
    res.status(200).json(updatedInitiative);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const deleteInitiative = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Initiative.destroy({
      where: { id }
    });
    
    if (deleted === 0) {
      res.status(404).json({ error: 'Initiative not found' });
      return;
    }
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// Jira integration methods
export const syncWithJira = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const initiative = await Initiative.findByPk(id);
    
    if (!initiative) {
      res.status(404).json({ error: 'Initiative not found' });
      return;
    }
    
    // Simulated Jira integration for now
    // In a real implementation, this would call the Jira API service
    res.status(200).json({ 
      message: 'Initiative synchronized with Jira',
      initiative
    });
  } catch (error) {
    next(error);
  }
};

// Load initiatives from JSON file
export const loadInitiativesFromJson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jsonPath = path.join(__dirname, '../../data/initiatives.json');
    
    if (!fs.existsSync(jsonPath)) {
      res.status(404).json({ error: 'Initiatives JSON file not found' });
      return;
    }
    
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const initiativesData = JSON.parse(jsonData);
    
    // Clear existing initiatives
    await Initiative.destroy({ where: {} });
    
    // Create new initiatives from JSON
    const createdInitiatives = [];
    for (const initiativeData of initiativesData) {
      try {
        const initiative = await Initiative.create(initiativeData);
        createdInitiatives.push(initiative);
      } catch (error) {
        console.error(`Failed to create initiative ${initiativeData.id}:`, error);
      }
    }
    
    res.status(200).json({
      message: `Successfully loaded ${createdInitiatives.length} initiatives from JSON`,
      initiatives: createdInitiatives
    });
  } catch (error) {
    console.error('Error loading initiatives from JSON:', error);
    next(error);
  }
};
