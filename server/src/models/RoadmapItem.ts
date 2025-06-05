import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Initiative from './Initiative';

class RoadmapItem extends Model {
  public id!: string;
  public initiativeId!: string;
  public initiativeName!: string;
  public startDate!: Date;
  public endDate!: Date;
  public status!: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  public priority!: 'high' | 'medium' | 'low';
  public dependencies!: string[];
  public estimatedEffort!: number;
  public actualEffort?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoadmapItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    initiativeId: {
      type: DataTypes.UUID,
      references: {
        model: 'initiatives',
        key: 'id',
      },
    },
    initiativeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'on_hold'),
      allowNull: false,
      defaultValue: 'planned',
    },
    priority: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      allowNull: false,
      defaultValue: 'medium',
    },
    dependencies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    estimatedEffort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    actualEffort: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'RoadmapItem',
    tableName: 'roadmap_items',
    timestamps: true,
  }
);

// Set up relationships
RoadmapItem.belongsTo(Initiative, { foreignKey: 'initiativeId', as: 'initiative' });
Initiative.hasOne(RoadmapItem, { foreignKey: 'initiativeId', as: 'roadmapItem' });

export default RoadmapItem;
