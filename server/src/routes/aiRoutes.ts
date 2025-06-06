import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import Initiative from '../models/Initiative';
import aiService from '../services/aiService';

const router = Router();

/**
 * Get AI-generated initiative improvement suggestions
 */
router.get('/initiative-suggestions/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const initiative = await Initiative.findByPk(id);
    
    if (!initiative) {
      res.status(404).json({ error: 'Initiative not found' });
      return;
    }
    
    const suggestions = await aiService.generateInitiativeSuggestions(initiative);
    res.status(200).json({ suggestions });
  } catch (error) {
    next(error);
  }
});

/**
 * Get AI-generated dependency analysis
 */
router.get('/dependency-analysis', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const initiatives = await Initiative.findAll();
    const analysis = await aiService.analyzeInitiativeDependencies(initiatives);
    res.status(200).json({ analysis });
  } catch (error) {
    next(error);
  }
});

/**
 * Get AI-generated executive summary
 */
router.get('/executive-summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const initiatives = await Initiative.findAll();
    const summary = await aiService.generateExecutiveSummary(initiatives);
    res.status(200).json({ summary });
  } catch (error) {
    next(error);
  }
});

/**
 * Answer natural language questions about initiatives
 */
router.post('/ask', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      res.status(400).json({ error: 'Question is required' });
      return;
    }
    
    const initiatives = await Initiative.findAll();
    const answer = await aiService.answerInitiativeQuestion(initiatives, question);
    res.status(200).json({ answer });
  } catch (error) {
    next(error);
  }
});

/**
 * Generate AI metrics based on initiative data
 */
router.post('/generate-metrics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { initiatives } = req.body;
    
    if (!initiatives || !Array.isArray(initiatives)) {
      res.status(400).json({ error: 'Initiatives array is required' });
      return;
    }
    
    const metrics = await aiService.generateAIMetrics(initiatives);
    res.status(200).json(metrics);
  } catch (error) {
    next(error);
  }
});

/**
 * Get contextual insights based on current view/data
 */
router.post('/contextual-insights', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { context, data } = req.body;
    
    if (!context) {
      res.status(400).json({ error: 'Context is required' });
      return;
    }
    
    const insights = await aiService.generateContextualInsights(context, data);
    res.status(200).json({ insights });
  } catch (error) {
    next(error);
  }
});

export default router;
