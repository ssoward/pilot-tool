
/**
 * @typedef {Object} TeamEfficiencyMetrics
 * @property {string} teamId
 * @property {string} teamName
 * @property {number} velocityScore
 * @property {number} qualityScore
 * @property {number} predictabilityScore
 * @property {number} overallEfficiency
 * @property {'improving'|'declining'|'stable'} trendDirection
 * @property {string[]} recommendations
 */

/**
 * @typedef {Object} CapacityTrendAnalysis
 * @property {Array<{period: string, totalCapacity: number, utilizedCapacity: number, efficiency: number, bottlenecks: string[]}>} timeline
 * @property {{capacity: 'increasing'|'decreasing'|'stable', utilization: 'improving'|'declining'|'stable', riskLevel: 'low'|'medium'|'high'}} projectedTrends
 */

/**
 * @typedef {Object} CrossTeamAnalysis
 * @property {Array<{teamA: string, teamB: string, collaborationScore: number, sharedInitiatives: number, conflictRate: number}>} collaborationMatrix
 * @property {Array<{initiativeId: string, initiativeName: string, dependentTeams: string[], criticalPath: string[], riskLevel: 'low'|'medium'|'high'}>} dependencyChains
 */

/**
 * @typedef {Object} PredictiveInsights
 * @property {{level: 'low'|'medium'|'high', probability: number, riskFactors: string[], mitigation: string[]}} deliveryRisk
 * @property {{rebalancingOpportunities: Array<{fromTeam: string, toTeam: string, estimatedImpact: string, confidence: number}>, capacityRecommendations: Array<{teamId: string, action: 'increase'|'decrease'|'maintain', reasoning: string}>}} resourceOptimization
 * @property {{parallelizationOpportunities: Array<{initiativeIds: string[], estimatedTimeSaving: number, requirements: string[]}>, criticalPathOptimizations: Array<{initiativeId: string, currentDuration: number, optimizedDuration: number, changes: string[]}>}} timelineOptimization
 */

class AnalyticsService {
  /**
   * Calculate team efficiency metrics based on historical performance
   */
  calculateTeamEfficiency(teams, initiatives, allocations) {
    return teams.map(team => {
      const teamAllocations = allocations.filter(alloc => alloc.teamId === team.id);
      const teamInitiatives = initiatives.filter(init => 
        init.assignedTeams?.includes(team.id)
      );

      // Calculate velocity score (completed initiatives vs allocated capacity)
      const completedInitiatives = teamInitiatives.filter(init => init.status === 'completed');
      const velocityScore = this.calculateVelocityScore(completedInitiatives, teamAllocations);

      // Calculate quality score (based on initiative success metrics)
      const qualityScore = this.calculateQualityScore(completedInitiatives);

      // Calculate predictability score (delivery vs estimates)
      const predictabilityScore = this.calculatePredictabilityScore(completedInitiatives);

      // Overall efficiency
      const overallEfficiency = (velocityScore + qualityScore + predictabilityScore) / 3;

      // Trend analysis
      const trendDirection = this.analyzeTrend(teamInitiatives);

      // Generate recommendations
      const recommendations = this.generateTeamRecommendations(
        velocityScore,
        qualityScore,
        predictabilityScore,
        teamAllocations[0]
      );

      return {
        teamId: team.id,
        teamName: team.name,
        velocityScore,
        qualityScore,
        predictabilityScore,
        overallEfficiency,
        trendDirection,
        recommendations
      };
    });
  }

  /**
   * Analyze capacity trends over time
   */
  analyzeCapacityTrends(teams, allocations) {
    // Generate timeline data for the last 6 months
    const timeline = this.generateCapacityTimeline(teams, allocations);

    // Analyze trends
    const projectedTrends = this.analyzeCapacityProjections(timeline);

    return {
      timeline,
      projectedTrends
    };
  }

  /**
   * Perform cross-team collaboration analysis
   */
  analyzeCrossTeamCollaboration(teams, initiatives) {
    // Build collaboration matrix
    const collaborationMatrix = this.buildCollaborationMatrix(teams, initiatives);

    // Analyze dependency chains
    const dependencyChains = this.analyzeDependencyChains(initiatives);

    return {
      collaborationMatrix,
      dependencyChains
    };
  }

  /**
   * Generate predictive insights and recommendations
   */
  generatePredictiveInsights(initiatives, allocations, conflicts) {
    // Analyze delivery risk
    const deliveryRisk = this.assessDeliveryRisk(initiatives, conflicts);

    // Resource optimization opportunities
    const resourceOptimization = this.identifyResourceOptimizations(allocations);

    // Timeline optimization opportunities
    const timelineOptimization = this.identifyTimelineOptimizations(initiatives);

    return {
      deliveryRisk,
      resourceOptimization,
      timelineOptimization
    };
  }

  // Private helper methods
  private calculateVelocityScore(
    completedInitiatives: Initiative[],
    allocations: ResourceAllocation[]
  ): number {
    if (completedInitiatives.length === 0) return 0;

    const totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.allocatedCapacity, 0);
    const totalCompleted = completedInitiatives.length;
    
    // Velocity score: initiatives completed per unit of capacity
    const velocityRatio = totalAllocated > 0 ? totalCompleted / totalAllocated : 0;
    return Math.min(velocityRatio * 100, 100); // Normalize to 0-100
  }

  private calculateQualityScore(completedInitiatives: Initiative[]): number {
    if (completedInitiatives.length === 0) return 0;

    // Quality score based on initiative success metrics
    // For now, assume all completed initiatives have quality score
    // In real implementation, this would be based on actual quality metrics
    const avgQuality = completedInitiatives.reduce((sum, init) => {
      // Simulate quality score based on priority and complexity
      const priorityScore = init.priority === 'critical' ? 90 : 
                           init.priority === 'high' ? 80 : 
                           init.priority === 'medium' ? 70 : 60;
      return sum + priorityScore;
    }, 0) / completedInitiatives.length;

    return avgQuality;
  }

  private calculatePredictabilityScore(completedInitiatives: Initiative[]): number {
    if (completedInitiatives.length === 0) return 0;

    // Predictability score based on estimate vs actual delivery
    const predictabilityScores = completedInitiatives.map(init => {
      // Simulate predictability based on estimated vs actual effort
      const estimatedEffort = init.estimatedEffort || 40;
      const actualEffort = estimatedEffort * (0.8 + Math.random() * 0.4); // Simulate variance
      const accuracy = Math.min(estimatedEffort, actualEffort) / Math.max(estimatedEffort, actualEffort);
      return accuracy * 100;
    });

    return predictabilityScores.reduce((sum, score) => sum + score, 0) / predictabilityScores.length;
  }

  private analyzeTrend(initiatives: Initiative[]): 'improving' | 'declining' | 'stable' {
    // Analyze trend based on recent completion rates
    const recentInitiatives = initiatives.filter(init => {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - 3);
      return init.endDate && init.endDate >= monthsAgo;
    });

    const completionRate = recentInitiatives.filter(init => init.status === 'completed').length / 
                          Math.max(recentInitiatives.length, 1);

    if (completionRate > 0.8) return 'improving';
    if (completionRate < 0.5) return 'declining';
    return 'stable';
  }

  private generateTeamRecommendations(
    velocityScore: number,
    qualityScore: number,
    predictabilityScore: number,
    allocation?: ResourceAllocation
  ): string[] {
    const recommendations = [];

    if (velocityScore < 50) {
      recommendations.push('Consider reducing team workload to improve delivery velocity');
    }

    if (qualityScore < 60) {
      recommendations.push('Implement additional quality assurance processes');
    }

    if (predictabilityScore < 60) {
      recommendations.push('Improve estimation accuracy through historical data analysis');
    }

    if (allocation && allocation.utilizationPercentage > 90) {
      recommendations.push('Team is at high utilization - consider load balancing');
    }

    if (recommendations.length === 0) {
      recommendations.push('Team is performing well - maintain current practices');
    }

    return recommendations;
  }

  private generateCapacityTimeline(
    teams: Team[],
    allocations: ResourceAllocation[]
  ): Array<{
    period: string;
    totalCapacity: number;
    utilizedCapacity: number;
    efficiency: number;
    bottlenecks: string[];
  }> {
    // Generate 6-month timeline
    const timeline = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    for (let i = 0; i < 6; i++) {
      const periodDate = new Date(startDate);
      periodDate.setMonth(periodDate.getMonth() + i);
      
      const totalCapacity = teams.reduce((sum, team) => sum + team.capacity, 0);
      const utilizedCapacity = allocations.reduce((sum, alloc) => sum + alloc.allocatedCapacity, 0);
      const efficiency = totalCapacity > 0 ? utilizedCapacity / totalCapacity : 0;
      
      // Identify bottlenecks (teams with >90% utilization)
      const bottlenecks = allocations
        .filter(alloc => alloc.utilizationPercentage > 90)
        .map(alloc => alloc.teamName);

      timeline.push({
        period: periodDate.toISOString().slice(0, 7), // YYYY-MM format
        totalCapacity,
        utilizedCapacity,
        efficiency,
        bottlenecks
      });
    }

    return timeline;
  }

  private analyzeCapacityProjections(timeline: any[]): {
    capacity: 'increasing' | 'decreasing' | 'stable';
    utilization: 'improving' | 'declining' | 'stable';
    riskLevel: 'low' | 'medium' | 'high';
  } {
    // Analyze trends in the timeline data
    const capacityTrend = timeline.length > 1 ? 
      (timeline[timeline.length - 1].totalCapacity > timeline[0].totalCapacity ? 'increasing' : 
       timeline[timeline.length - 1].totalCapacity < timeline[0].totalCapacity ? 'decreasing' : 'stable') :
      'stable';

    const utilizationTrend = timeline.length > 1 ?
      (timeline[timeline.length - 1].efficiency > timeline[0].efficiency ? 'improving' :
       timeline[timeline.length - 1].efficiency < timeline[0].efficiency ? 'declining' : 'stable') :
      'stable';

    // Assess risk level based on utilization and bottlenecks
    const avgBottlenecks = timeline.reduce((sum, period) => sum + period.bottlenecks.length, 0) / timeline.length;
    const avgUtilization = timeline.reduce((sum, period) => sum + period.efficiency, 0) / timeline.length;

    const riskLevel = avgUtilization > 0.9 || avgBottlenecks > 2 ? 'high' :
                      avgUtilization > 0.8 || avgBottlenecks > 1 ? 'medium' : 'low';

    return {
      capacity: capacityTrend,
      utilization: utilizationTrend,
      riskLevel
    };
  }

  private buildCollaborationMatrix(teams: Team[], initiatives: Initiative[]): Array<{
    teamA: string;
    teamB: string;
    collaborationScore: number;
    sharedInitiatives: number;
    conflictRate: number;
  }> {
    const matrix = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const teamA = teams[i];
        const teamB = teams[j];

        // Find shared initiatives
        const sharedInitiatives = initiatives.filter(init =>
          init.assignedTeams?.includes(teamA.id) && init.assignedTeams?.includes(teamB.id)
        );

        // Calculate collaboration score
        const collaborationScore = sharedInitiatives.length * 10; // Simple scoring

        // Simulate conflict rate
        const conflictRate = Math.random() * 0.1; // 0-10% conflict rate

        matrix.push({
          teamA: teamA.name,
          teamB: teamB.name,
          collaborationScore,
          sharedInitiatives: sharedInitiatives.length,
          conflictRate
        });
      }
    }

    return matrix;
  }

  private analyzeDependencyChains(initiatives: Initiative[]): Array<{
    initiativeId: string;
    initiativeName: string;
    dependentTeams: string[];
    criticalPath: string[];
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    return initiatives.map(init => {
      const dependentTeams = init.assignedTeams || [];
      const criticalPath = [init.name]; // Simplified critical path
      
      // Assess risk level based on team count and complexity
      const riskLevel = dependentTeams.length > 3 ? 'high' :
                        dependentTeams.length > 1 ? 'medium' : 'low';

      return {
        initiativeId: init.id,
        initiativeName: init.name,
        dependentTeams,
        criticalPath,
        riskLevel
      };
    });
  }

  private assessDeliveryRisk(
    initiatives: Initiative[],
    conflicts: ResourceConflict[]
  ): {
    level: 'low' | 'medium' | 'high';
    probability: number;
    riskFactors: string[];
    mitigation: string[];
  } {
    const riskFactors = [];
    const mitigation = [];

    // Check for high-priority initiatives with tight deadlines
    const criticalInitiatives = initiatives.filter(init => init.priority === 'critical');
    if (criticalInitiatives.length > 0) {
      riskFactors.push(`${criticalInitiatives.length} critical initiatives in progress`);
      mitigation.push('Prioritize critical initiatives and allocate additional resources');
    }

    // Check for resource conflicts
    const highConflicts = conflicts.filter(conflict => conflict.severity === 'high');
    if (highConflicts.length > 0) {
      riskFactors.push(`${highConflicts.length} high-severity resource conflicts`);
      mitigation.push('Resolve resource conflicts through reallocation or timeline adjustments');
    }

    // Assess overall risk level
    const riskScore = riskFactors.length;
    const level = riskScore > 2 ? 'high' : riskScore > 0 ? 'medium' : 'low';
    const probability = Math.min(riskScore * 0.3, 0.9); // Max 90% probability

    return {
      level,
      probability,
      riskFactors,
      mitigation
    };
  }

  private identifyResourceOptimizations(
    allocations: ResourceAllocation[]
  ): {
    rebalancingOpportunities: Array<{
      fromTeam: string;
      toTeam: string;
      estimatedImpact: string;
      confidence: number;
    }>;
    capacityRecommendations: Array<{
      teamId: string;
      action: 'increase' | 'decrease' | 'maintain';
      reasoning: string;
    }>;
  } {
    const rebalancingOpportunities: Array<{
      fromTeam: string;
      toTeam: string;
      estimatedImpact: string;
      confidence: number;
    }> = [];
    const capacityRecommendations: Array<{
      teamId: string;
      action: 'increase' | 'decrease' | 'maintain';
      reasoning: string;
    }> = [];

    // Find over and under-utilized teams
    const overUtilized = allocations.filter(alloc => alloc.utilizationPercentage > 90);
    const underUtilized = allocations.filter(alloc => alloc.utilizationPercentage < 60);

    // Generate rebalancing opportunities
    overUtilized.forEach(over => {
      const candidate = underUtilized.find(under => under.teamId !== over.teamId);
      if (candidate) {
        rebalancingOpportunities.push({
          fromTeam: over.teamName,
          toTeam: candidate.teamName,
          estimatedImpact: 'Could reduce overallocation by 20% and improve delivery times',
          confidence: 0.75
        });
      }
    });

    // Generate capacity recommendations
    allocations.forEach(alloc => {
      let action: 'increase' | 'decrease' | 'maintain' = 'maintain';
      let reasoning = 'Current capacity is optimal';

      if (alloc.utilizationPercentage > 95) {
        action = 'increase';
        reasoning = 'Team is severely overallocated and at risk of burnout';
      } else if (alloc.utilizationPercentage < 50) {
        action = 'decrease';
        reasoning = 'Team has significant unused capacity that could be reallocated';
      }

      capacityRecommendations.push({
        teamId: alloc.teamId,
        action,
        reasoning
      });
    });

    return {
      rebalancingOpportunities,
      capacityRecommendations
    };
  }

  private identifyTimelineOptimizations(initiatives: Initiative[]): {
    parallelizationOpportunities: Array<{
      initiativeIds: string[];
      estimatedTimeSaving: number;
      requirements: string[];
    }>;
    criticalPathOptimizations: Array<{
      initiativeId: string;
      currentDuration: number;
      optimizedDuration: number;
      changes: string[];
    }>;
  } {
    const parallelizationOpportunities: Array<{
      initiativeIds: string[];
      estimatedTimeSaving: number;
      requirements: string[];
    }> = [];
    const criticalPathOptimizations: Array<{
      initiativeId: string;
      currentDuration: number;
      optimizedDuration: number;
      changes: string[];
    }> = [];

    // Find initiatives that could be parallelized
    const inProgressInitiatives = initiatives.filter(init => init.status === 'in_progress');
    if (inProgressInitiatives.length > 1) {
      // Group initiatives that don't share teams
      const groups = this.groupNonConflictingInitiatives(inProgressInitiatives);
      groups.forEach(group => {
        if (group.length > 1) {
          parallelizationOpportunities.push({
            initiativeIds: group.map(init => init.id),
            estimatedTimeSaving: 30, // 30 days estimated saving
            requirements: ['Ensure no resource conflicts', 'Coordinate cross-team dependencies']
          });
        }
      });
    }

    // Find critical path optimizations
    initiatives.forEach(init => {
      if (init.startDate && init.endDate) {
        const currentDuration = Math.ceil(
          (init.endDate.getTime() - init.startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (currentDuration > 90) { // Long initiatives
          const optimizedDuration = Math.ceil(currentDuration * 0.8); // 20% improvement
          criticalPathOptimizations.push({
            initiativeId: init.id,
            currentDuration,
            optimizedDuration,
            changes: [
              'Increase team allocation',
              'Parallelize development tasks',
              'Reduce scope to MVP'
            ]
          });
        }
      }
    });

    return {
      parallelizationOpportunities,
      criticalPathOptimizations
    };
  }

  private groupNonConflictingInitiatives(initiatives: Initiative[]): Initiative[][] {
    // Simple grouping algorithm - in practice this would be more sophisticated
    const groups: Initiative[][] = [];
    const used = new Set<string>();

    initiatives.forEach(init => {
      if (!used.has(init.id)) {
        const group = [init];
        used.add(init.id);
        
        // Find other initiatives that don't conflict
        initiatives.forEach(other => {
          if (!used.has(other.id) && !this.hasTeamConflict(init, other)) {
            group.push(other);
            used.add(other.id);
          }
        });
        
        groups.push(group);
      }
    });

    return groups;
  }

  private hasTeamConflict(initA: Initiative, initB: Initiative): boolean {
    const teamsA = initA.assignedTeams || [];
    const teamsB = initB.assignedTeams || [];
    return teamsA.some(team => teamsB.includes(team));
  }
}

export const analyticsService = new AnalyticsService();
