import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface InitiativeAttributes {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate?: Date;
  endDate?: Date;
  jiraKey?: string;
  jiraUrl?: string;
  businessValue?: string;
  dependencies?: string[];
  goals?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InitiativeCreationAttributes extends Omit<InitiativeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Initiative extends Model<InitiativeAttributes, InitiativeCreationAttributes> implements InitiativeAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public owner!: string;
  public status!: 'draft' | 'approved' | 'in_progress' | 'completed' | 'on_hold';
  public priority!: 'low' | 'medium' | 'high' | 'critical';
  public startDate?: Date;
  public endDate?: Date;
  public jiraKey?: string;
  public jiraUrl?: string;
  public businessValue?: string;
  public dependencies?: string[];
  public goals?: string[];
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Initiative.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'approved', 'in_progress', 'completed', 'on_hold'),
    allowNull: false,
    defaultValue: 'draft'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  jiraKey: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jiraUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  businessValue: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dependencies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  goals: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  }
}, {
  sequelize,
  tableName: 'initiatives',
  modelName: 'Initiative',
  timestamps: true
});

export default Initiative;
