import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

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
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false
    };
  }
};

class ResourceConflict extends Model {
  public id!: string;
  public type!: 'overallocation' | 'skill_gap' | 'timeline_conflict';
  public severity!: 'high' | 'medium' | 'low';
  public description!: string;
  public affectedTeams!: string[];
  public affectedInitiatives!: string[];
  public suggestedResolution!: string;
  public detectedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ResourceConflict.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('overallocation', 'skill_gap', 'timeline_conflict'),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    affectedTeams: {
      ...getArrayFieldType(),
      allowNull: false
    },
    affectedInitiatives: {
      ...getArrayFieldType(),
      allowNull: false
    },
    suggestedResolution: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    detectedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'ResourceConflict',
    tableName: 'resource_conflicts',
    timestamps: true,
  }
);

export default ResourceConflict;
