import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// Helper function to handle array fields for different database types
const getArrayFieldType = () => {
  const dialect = sequelize.getDialect();
  if (dialect === 'sqlite') {
    return {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]',
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

export interface WorkingGroup {
  label: string;
  value: string;
  __typename?: string;
}

export interface OpportunityScore {
  impact: number;
  effort: number;
  calculated: number | null;
  __typename?: string;
}

export interface Hypothesis {
  businessOutcome: string;
  feature: string;
  goal: string;
  peopleSegment: string;
  __typename?: string;
}

export interface InitiativeAttributes {
  id: string;
  productGroupName?: string;
  productGroupId?: string;
  summary?: string;
  teamName?: string;
  teamId?: string;
  type?: 'adaptive' | 'initiative';
  stage?: string;
  status: 'Draft' | 'Proposal' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  score?: number;
  workingGroup?: WorkingGroup | null;
  opportunityScore?: OpportunityScore;
  hypothesis?: Hypothesis;
  businessValue?: string;
  jiraProjectKey?: string;
  jiraProjectId?: string;
  mondayBoardId?: string;
  contributingTeams?: string[];
  percentComplete?: number;
  onTrackPercent?: number;
  __typename?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Legacy fields for backward compatibility
  name?: string;
  description?: string;
  owner?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  startDate?: Date;
  endDate?: Date;
  jiraKey?: string;
  jiraUrl?: string;
  dependencies?: string[];
  goals?: string[];
  assignedTeams?: string[];
  estimatedEffort?: number;
  actualEffort?: number;
  requiredSkills?: string[];
}

export interface InitiativeCreationAttributes extends Omit<InitiativeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Initiative extends Model<InitiativeAttributes, InitiativeCreationAttributes> implements InitiativeAttributes {
  public id!: string;
  public productGroupName?: string;
  public productGroupId?: string;
  public summary?: string;
  public teamName?: string;
  public teamId?: string;
  public type?: 'adaptive' | 'initiative';
  public stage?: string;
  public status!: 'Draft' | 'Proposal' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  public score?: number;
  public workingGroup?: WorkingGroup | null;
  public opportunityScore?: OpportunityScore;
  public hypothesis?: Hypothesis;
  public businessValue?: string;
  public jiraProjectKey?: string;
  public jiraProjectId?: string;
  public mondayBoardId?: string;
  public contributingTeams?: string[];
  public percentComplete?: number;
  public onTrackPercent?: number;
  public __typename?: string;
  
  // Legacy fields for backward compatibility
  public name?: string;
  public description?: string;
  public owner?: string;
  public priority?: 'low' | 'medium' | 'high' | 'critical';
  public startDate?: Date;
  public endDate?: Date;
  public jiraKey?: string;
  public jiraUrl?: string;
  public dependencies?: string[];
  public goals?: string[];
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
    type: DataTypes.STRING,
    primaryKey: true
  },
  productGroupName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  productGroupId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  teamId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  type: {
    type: DataTypes.ENUM('adaptive', 'initiative'),
    allowNull: true,
    defaultValue: 'initiative'
  },
  stage: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Investigate'
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Proposal', 'Active', 'Completed', 'On Hold', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Draft'
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  workingGroup: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  opportunityScore: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      impact: 0,
      effort: 0,
      calculated: null
    }
  },
  hypothesis: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      businessOutcome: '',
      feature: '',
      goal: '',
      peopleSegment: ''
    }
  },
  businessValue: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  jiraProjectKey: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jiraProjectId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mondayBoardId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contributingTeams: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '[]',
    get(this: any) {
      const value = this.getDataValue('contributingTeams');
      return value ? JSON.parse(value) : [];
    },
    set(this: any, value: string[]) {
      this.setDataValue('contributingTeams', JSON.stringify(value || []));
    }
  },
  percentComplete: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  onTrackPercent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  __typename: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Legacy fields for backward compatibility
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: true
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
