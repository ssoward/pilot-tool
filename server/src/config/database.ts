import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
config();

// Database connection configuration with SQLite fallback for local development
const createSequelizeInstance = () => {
  // Check if we should use SQLite (when PostgreSQL is not available)
  const useSQLite = process.env.USE_SQLITE === 'true' || process.env.NODE_ENV === 'development';
  
  if (useSQLite) {
    console.log('Using SQLite for local development');
    return new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../data/pilot_tool.sqlite'),
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    });
  } else {
    console.log('Using PostgreSQL for production/staging');
    return new Sequelize(
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
  }
};

const sequelize = createSequelizeInstance();

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
    
    // Setup model associations after all models are imported
    const { setupAssociations } = await import('../models/associations');
    setupAssociations();
    
    // For SQLite in development, skip sync if database already exists to prevent migration loops
    // if (process.env.USE_SQLITE === 'true' && process.env.NODE_ENV === 'development') {
    //   const fs = require('fs');
    //   const dbPath = path.join(__dirname, '../../data/pilot_tool.sqlite');
    //   
    //   if (fs.existsSync(dbPath)) {
    //     console.log('Database synchronized successfully. (SQLite database already exists, skipping sync)');
    //     return;
    //   }
    // }
    
    // Sync options based on environment
    const syncOptions = process.env.USE_SQLITE === 'true' 
      ? { force: false, alter: true } 
      : { force: false, alter: true };
    
    await sequelize.sync(syncOptions);
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

export { sequelize, testConnection, syncDatabase };
export default sequelize;
