import { sequelize } from './database';
import path from 'path';
import fs from 'fs';
import Initiative from '../models/Initiative';
import { InitiativeCreationAttributes } from '../models/Initiative';
import Employee from '../models/Employee';
import Team from '../models/Team';

const seedInitiatives: InitiativeCreationAttributes[] = [
  {
    name: 'UI Redesign Project',
    description: 'Complete redesign of the customer-facing UI components for better user experience',
    owner: 'Jane Smith',
    status: 'Active' as const,
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
    status: 'Active' as const,
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
    status: 'Draft' as const,
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
    status: 'Draft' as const,
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
    status: 'Active' as const,
    priority: 'critical' as const,
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-08-15'),
    businessValue: 'Ensure regulatory compliance and protect sensitive user data',
    dependencies: ['Authentication Service', 'Data Encryption Service'],
    goals: ['Meet compliance standards', 'Enhance data protection', 'Implement security audits']
  }
];

// Helper function to map status values from JSON to our model
const mapStatus = (status: string): 'Draft' | 'Proposal' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled' => {
  const statusMap: { [key: string]: 'Draft' | 'Proposal' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled' } = {
    'Draft': 'Draft',
    'Proposal': 'Proposal', 
    'Active': 'Active',
    'Completed': 'Completed',
    'On Hold': 'On Hold',
    'Cancelled': 'Cancelled',
    'Investigate': 'Draft', // Map investigate to draft
    'Build': 'Active',
    'Test': 'Active',
    'Deploy': 'Active',
    'Complete': 'Completed',
    'Paused': 'On Hold',
    'Stopped': 'Cancelled'
  };
  
  return statusMap[status] || 'Draft';
};

const seed = async () => {
  try {
    // Sync database models
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
    
    // Load and seed employees from JSON file
    const employeesFilePath = path.join(__dirname, '../../data/employees.json');
    if (fs.existsSync(employeesFilePath)) {
      console.log('Loading employees from JSON file...');
      const employeesData = JSON.parse(fs.readFileSync(employeesFilePath, 'utf8'));
      
      // Batch the employee data to avoid memory issues with large datasets
      const batchSize = 100;
      
      for (let i = 0; i < employeesData.length; i += batchSize) {
        const batch = employeesData.slice(i, i + batchSize);
        await Employee.bulkCreate(batch, { 
          ignoreDuplicates: true,
          updateOnDuplicate: ['firstName', 'lastName', 'role', 'grade', 'mgrName', 'mgrHrEmpId']
        });
        console.log(`Imported employees batch ${i/batchSize + 1}/${Math.ceil(employeesData.length/batchSize)}`);
      }
      
      console.log(`Database seeded successfully with ${employeesData.length} employees`);
    } else {
      console.warn('Could not find employees.json file for seeding');
    }

    // Load and seed teams from JSON file
    const teamsFilePath = path.join(__dirname, '../../data/teams.json');
    if (fs.existsSync(teamsFilePath)) {
      console.log('Loading teams from JSON file...');
      const teamsData = JSON.parse(fs.readFileSync(teamsFilePath, 'utf8'));
      
      // Transform teams data to match our Team model
      const transformedTeams = teamsData.map((team: any) => ({
        // Use teamId as string for the UUID field or generate new UUID
        name: team.teamName,
        description: team.teamDescription || '',
        managerId: `mgr-${team.teamId}`, // Create manager ID based on team ID
        managerName: 'Team Manager', // Default manager name since it's not in the JSON
        capacity: team.empCount * 8, // Assume 8 hours per employee as capacity
        currentWorkload: Math.floor((team.empCount * 8) * 0.7), // Assume 70% utilization
        memberCount: team.empCount,
        skills: [], // Empty skills array since not provided in JSON
      }));

      // Batch create teams
      const teamBatchSize = 50;
      for (let i = 0; i < transformedTeams.length; i += teamBatchSize) {
        const batch = transformedTeams.slice(i, i + teamBatchSize);
        await Team.bulkCreate(batch, { 
          ignoreDuplicates: true,
        });
        console.log(`Imported teams batch ${i/teamBatchSize + 1}/${Math.ceil(transformedTeams.length/teamBatchSize)}`);
      }
      
      console.log(`Database seeded successfully with ${transformedTeams.length} teams`);
    } else {
      console.warn('Could not find teams.json file for seeding');
    }

    // Load and seed initiatives from JSON file
    const initiativesFilePath = path.join(__dirname, '../../data/initiatives.json');
    if (fs.existsSync(initiativesFilePath)) {
      console.log('Loading initiatives from JSON file...');
      const initiativesData = JSON.parse(fs.readFileSync(initiativesFilePath, 'utf8'));
      
      // Transform initiatives data to match our Initiative model
      const transformedInitiatives = initiativesData.map((initiative: any) => ({
        id: initiative.id,
        productGroupName: initiative.productGroupName,
        productGroupId: initiative.productGroupId,
        summary: initiative.summary,
        teamName: initiative.teamName,
        teamId: initiative.teamId,
        type: initiative.type as 'adaptive' | 'initiative',
        stage: initiative.stage,
        status: mapStatus(initiative.status),
        score: initiative.score || 0,
        workingGroup: initiative.workingGroup || null,
        opportunityScore: initiative.opportunityScore || { impact: 0, effort: 0, calculated: null },
        hypothesis: initiative.hypothesis || null,
        businessValue: initiative.businessValue,
        jiraProjectKey: initiative.jiraProjectKey || null,
        jiraProjectId: initiative.jiraProjectId || null,
        mondayBoardId: initiative.mondayBoardId || null,
        contributingTeams: initiative.contributingTeams || [],
        percentComplete: initiative.percentComplete || 0,
        onTrackPercent: initiative.onTrackPercent || 0,
        dependencies: [],
        goals: [],
        assignedTeams: [],
        estimatedEffort: 0,
        requiredSkills: [],
      }));

      // Batch create initiatives
      const initiativeBatchSize = 50;
      for (let i = 0; i < transformedInitiatives.length; i += initiativeBatchSize) {
        const batch = transformedInitiatives.slice(i, i + initiativeBatchSize);
        await Initiative.bulkCreate(batch, { 
          ignoreDuplicates: true,
        });
        console.log(`Imported initiatives batch ${i/initiativeBatchSize + 1}/${Math.ceil(transformedInitiatives.length/initiativeBatchSize)}`);
      }
      
      console.log(`Database seeded successfully with ${transformedInitiatives.length} initiatives`);
    } else {
      console.warn('Could not find initiatives.json file for seeding');
    }

    // Seed additional sample initiatives for completeness
    for (const initiativeData of seedInitiatives) {
      await Initiative.create(initiativeData);
    }
    console.log('Database seeded successfully with additional sample initiatives');
    
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
