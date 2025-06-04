import { sequelize } from './database';
import Initiative from '../models/Initiative';
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

const seed = async () => {
  try {
    // Sync database models
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
    
    // Seed initiatives
    for (const initiativeData of seedInitiatives) {
      await Initiative.create(initiativeData);
    }
    
    console.log('Database seeded successfully with 5 initiatives');
    
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
