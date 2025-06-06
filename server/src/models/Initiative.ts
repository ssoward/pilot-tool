import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// Helper function to handle array fields for different database types
const getArrayFieldType = () => {
  const dialect = sequelize.getDialect();
  if (dialect === 'sqlite') {
    return {
      type: DataTypes.TEXT,
      get(this: any) {
        const value = this.getDataValue(arguments[0]);
        return value ? JSON.parse(value) : [];
      },
      set(this: any, value: string[]) {
        this.setDataValue(arguments[0], JSON.stringify(value || []));
      }
    };
  } else {
    return {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    };
  }
};

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
  
  // Enhanced fields for team management and resource planning
  assignedTeams?: string[];
  estimatedEffort?: number;
  actualEffort?: number;
  requiredSkills?: string[];
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
  
  // Team management and resource planning fields
  public assignedTeams?: string[];
  public estimatedEffort?: number;
  public actualEffort?: number;
  public requiredSkills?: string[];
  
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
    ...getArrayFieldType(),
    allowNull: true
  },
  goals: {
    ...getArrayFieldType(),
    allowNull: true
  },
  assignedTeams: {
    ...getArrayFieldType(),
    allowNull: true
  },
  estimatedEffort: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  actualEffort: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  requiredSkills: {
    ...getArrayFieldType(),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'initiatives',
  modelName: 'Initiative',
  timestamps: true
});

export default Initiative;
