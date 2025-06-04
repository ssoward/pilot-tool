import { Request, Response, NextFunction } from 'express';
import Initiative from '../models/Initiative';
import { ValidationError } from 'sequelize';

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
