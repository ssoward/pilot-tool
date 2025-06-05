import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import RoadmapItem from './RoadmapItem';

class RoadmapMilestone extends Model {
  public id!: string;
  public roadmapItemId!: string;
  public name!: string;
  public date!: Date;
  public status!: 'upcoming' | 'completed' | 'missed';
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RoadmapMilestone.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roadmapItemId: {
      type: DataTypes.UUID,
      references: {
        model: 'roadmap_items',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'completed', 'missed'),
      allowNull: false,
      defaultValue: 'upcoming',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'RoadmapMilestone',
    tableName: 'roadmap_milestones',
    timestamps: true,
  }
);

// Set up relationships
RoadmapMilestone.belongsTo(RoadmapItem, { foreignKey: 'roadmapItemId', as: 'roadmapItem' });
RoadmapItem.hasMany(RoadmapMilestone, { foreignKey: 'roadmapItemId', as: 'milestones' });

export default RoadmapMilestone;
