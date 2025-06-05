import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// Load environment variables
config();

// Database connection configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'pilot_tool',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Sync all models
const syncDatabase = async () => {
  try {
    // Import models to ensure they are registered
    await import('../models/Initiative');
    await import('../models/Team');
    await import('../models/TeamMember');
    await import('../models/TeamAssignment');
    await import('../models/RoadmapItem');
    await import('../models/RoadmapMilestone');
    await import('../models/ResourceConflict');
    
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

export { sequelize, testConnection, syncDatabase };
export default sequelize;
