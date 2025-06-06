import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

// Helper function to handle array fields for different database types
const getArrayFieldType = () => {
  const dialect = sequelize.getDialect();
  if (dialect === 'sqlite') {
    return {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]',
      get(this: any) {
        const value = this.getDataValue('skills');
        try {
          return value ? JSON.parse(value) : [];
        } catch {
          return [];
        }
      },
      set(this: any, value: string[]) {
        this.setDataValue('skills', JSON.stringify(value || []));
      }
    };
  } else {
    return {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    };
  }
};

class TeamMember extends Model {
  public id!: string;
  public teamId!: string;
  public userId!: string;
  public name!: string;
  public email!: string;
  public role!: 'lead' | 'senior' | 'mid' | 'junior';
  public capacity!: number;
  public currentWorkload!: number;
  public skills!: string[];
  public readonly joinedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TeamMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teamId: {
      type: DataTypes.UUID,
      references: {
        model: 'teams',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('lead', 'senior', 'mid', 'junior'),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    currentWorkload: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    skills: getArrayFieldType(),
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'TeamMember',
    tableName: 'team_members',
    timestamps: true,
  }
);

export default TeamMember;
