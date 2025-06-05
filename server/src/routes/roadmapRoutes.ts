import { Router } from 'express';
import * as roadmapController from '../controllers/roadmapController';

const router = Router();

// Roadmap Item routes
router.get('/roadmap', roadmapController.getRoadmapItems);
router.get('/roadmap/:id', roadmapController.getRoadmapItem);
router.post('/roadmap', roadmapController.createRoadmapItem);
router.put('/roadmap/:id', roadmapController.updateRoadmapItem);
router.delete('/roadmap/:id', roadmapController.deleteRoadmapItem);

// Timeline Management routes
router.put('/roadmap/:id/timeline', roadmapController.updateItemTimeline);
router.put('/roadmap/bulk-timeline', roadmapController.bulkUpdateTimeline);

// Milestone routes
router.post('/roadmap-milestones', roadmapController.createRoadmapMilestone);
router.put('/roadmap-milestones/:id', roadmapController.updateRoadmapMilestone);
router.delete('/roadmap-milestones/:id', roadmapController.deleteRoadmapMilestone);

// Analysis routes
router.get('/roadmap-analysis', roadmapController.getTimelineAnalysis);

export default router;
