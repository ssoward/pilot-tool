import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

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
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
    },
    affectedInitiatives: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
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
