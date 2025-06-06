import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class TeamAssignment extends Model {
  public id!: string;
  public initiativeId!: string;
  public teamId!: string;
  public allocatedCapacity!: number;
  public startDate!: Date;
  public endDate!: Date;
  public role!: 'primary' | 'supporting';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TeamAssignment.init(
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
    teamId: {
      type: DataTypes.UUID,
      references: {
        model: 'teams',
        key: 'id',
      },
    },
    allocatedCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      validate: {
        min: 0,
        max: 100,
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('primary', 'supporting'),
      allowNull: false,
      defaultValue: 'primary',
    },
  },
  {
    sequelize,
    modelName: 'TeamAssignment',
    tableName: 'team_assignments',
    timestamps: true,
  }
);

export default TeamAssignment;
