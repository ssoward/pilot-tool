import { sequelize } from './database';
import Initiative from '../models/Initiative';
import Team from '../models/Team';
import TeamAssignment from '../models/TeamAssignment';
import { InitiativeCreationAttributes } from '../models/Initiative';

const seedInitiatives: InitiativeCreationAttributes[] = [
  {
    name: 'UI Redesign Project',
    description: 'Complete redesign of the customer-facing UI components for better user experience',
    owner: 'Jane Smith',
    status: 'in_progress' as const,
    priority: 'high' as const,
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-09-30'),
    businessValue: 'Increase user engagement by 30% and reduce bounce rate by 15%',
    dependencies: ['Authentication Service', 'API Gateway'],
    goals: ['Improve UX', 'Increase mobile responsiveness', 'Implement design system']
  },
  {
    name: 'Database Migration',
    description: 'Migrate legacy database to new cloud-based solution with improved scalability',
    owner: 'Michael Johnson',
    status: 'approved' as const,
    priority: 'critical' as const,
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-12-31'),
    businessValue: 'Reduce operational costs by 25% and improve query performance by 40%',
    dependencies: ['Data Backup Service', 'Authentication Service'],
    goals: ['Zero downtime migration', 'Improved performance', 'Better data integrity']
  },
  {
    name: 'API Performance Optimization',
    description: 'Optimize critical APIs to improve response times and reduce server load',
    owner: 'David Lee',
    status: 'draft' as const,
    priority: 'medium' as const,
    startDate: new Date('2025-08-15'),
    endDate: new Date('2025-10-15'),
    businessValue: 'Improve API response times by 60% and reduce server costs by 20%',
    dependencies: ['API Gateway', 'Monitoring Service'],
    goals: ['Reduce latency', 'Implement caching', 'Optimize database queries']
  },
  {
    name: 'Mobile App Development',
    description: 'Develop native mobile applications for iOS and Android platforms',
    owner: 'Sarah Wilson',
    status: 'draft' as const,
    priority: 'high' as const,
    startDate: new Date('2025-09-01'),
    endDate: new Date('2026-03-31'),
    businessValue: 'Expand user base by 40% and increase mobile engagement by 50%',
    dependencies: ['Authentication Service', 'Push Notification Service'],
    goals: ['Cross-platform functionality', 'Offline support', 'Seamless sync with web app']
  },
  {
    name: 'Security Compliance Update',
    description: 'Update security protocols to comply with new regulatory requirements',
    owner: 'Robert Brown',
    status: 'approved' as const,
    priority: 'critical' as const,
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-08-15'),
    businessValue: 'Ensure regulatory compliance and protect sensitive user data',
    dependencies: ['Authentication Service', 'Data Encryption Service'],
    goals: ['Meet compliance standards', 'Enhance data protection', 'Implement security audits']
  }
];

const seedTeams = [
  {
    name: 'Frontend Development Team',
    description: 'Team responsible for React and TypeScript frontend development',
    managerId: '550e8400-e29b-41d4-a716-446655440000',
    managerName: 'John Smith',
    capacity: 100,
    currentWorkload: 0,
    skills: []
  },
  {
    name: 'Backend Development Team',
    description: 'Team responsible for Node.js and database development',
    managerId: '550e8400-e29b-41d4-a716-446655440001',
    managerName: 'Alice Johnson',
    capacity: 100,
    currentWorkload: 80,
    skills: []
  },
  {
    name: 'QA Testing Team',
    description: 'Team responsible for quality assurance and testing',
    managerId: '550e8400-e29b-41d4-a716-446655440002',
    managerName: 'Mike Wilson',
    capacity: 100,
    currentWorkload: 60,
    skills: []
  }
];

const seed = async () => {
  try {
    // Sync database models with force: true to clean slate
    await sequelize.sync({ force: true });
    console.log('Database synced successfully (clean slate)');
    
    // Seed initiatives first
    const createdInitiatives = [];
    for (const initiativeData of seedInitiatives) {
      const initiative = await Initiative.create(initiativeData);
      createdInitiatives.push(initiative);
    }
    console.log(`Created ${createdInitiatives.length} initiatives`);
    
    // Seed teams
    const createdTeams = [];
    for (const teamData of seedTeams) {
      const team = await Team.create(teamData);
      createdTeams.push(team);
    }
    console.log(`Created ${createdTeams.length} teams`);
    
    // Create some sample team assignments (only if we have both initiatives and teams)
    if (createdInitiatives.length > 0 && createdTeams.length > 0) {
      const sampleAssignments = [
        {
          initiativeId: createdInitiatives[0].id, // UI Redesign Project
          teamId: createdTeams[0].id, // Frontend Development Team
          allocatedCapacity: 60,
          startDate: new Date('2025-06-01'),
          endDate: new Date('2025-12-31'),
          role: 'primary' as const
        },
        {
          initiativeId: createdInitiatives[1].id, // Database Migration
          teamId: createdTeams[1].id, // Backend Development Team
          allocatedCapacity: 80,
          startDate: new Date('2025-07-01'),
          endDate: new Date('2025-10-31'),
          role: 'primary' as const
        },
        {
          initiativeId: createdInitiatives[0].id, // UI Redesign Project
          teamId: createdTeams[1].id, // Backend Development Team (supporting)
          allocatedCapacity: 20,
          startDate: new Date('2025-05-01'),
          endDate: new Date('2025-09-30'),
          role: 'supporting' as const
        }
      ];

      for (const assignmentData of sampleAssignments) {
        await TeamAssignment.create(assignmentData);
      }
      console.log(`Created ${sampleAssignments.length} team assignments`);
    }
    
    console.log('Database seeded successfully with initiatives, teams, and assignments');
    
    // Close database connection
    await sequelize.close();
    
  } catch (error) {
    console.error('Error seeding database:', error);
    await sequelize.close();
    process.exit(1);
  }
};

// Run seed function
seed();
