// Model associations setup
// This file prevents circular dependency issues by centralizing all model relationships

import Team from './Team';
import TeamMember from './TeamMember';
import TeamAssignment from './TeamAssignment';
import Initiative from './Initiative';

export function setupAssociations() {
  // Team <-> TeamMember relationships
  Team.hasMany(TeamMember, { 
    foreignKey: 'teamId', 
    as: 'members',
    onDelete: 'CASCADE'
  });
  
  TeamMember.belongsTo(Team, { 
    foreignKey: 'teamId', 
    as: 'team' 
  });

  // Team <-> TeamAssignment relationships
  Team.hasMany(TeamAssignment, { 
    foreignKey: 'teamId', 
    as: 'assignments',
    onDelete: 'CASCADE'
  });
  
  TeamAssignment.belongsTo(Team, { 
    foreignKey: 'teamId', 
    as: 'team' 
  });

  // Initiative <-> TeamAssignment relationships
  Initiative.hasMany(TeamAssignment, { 
    foreignKey: 'initiativeId', 
    as: 'teamAssignments',
    onDelete: 'CASCADE'
  });
  
  TeamAssignment.belongsTo(Initiative, { 
    foreignKey: 'initiativeId', 
    as: 'initiative' 
  });

  console.log('✓ Model associations setup complete');
}
