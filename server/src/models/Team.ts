import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Team extends Model {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public managerId!: string;
  public managerName!: string;
  public capacity!: number;
  public currentWorkload!: number;
  public memberCount!: number;
  public skills!: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public assignments?: any[]; // Add this property for typing (should be TeamAssignment[] in a full type-safe setup)
}

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

Team.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    managerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    managerName: {
      type: DataTypes.STRING,
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
    memberCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    skills: getArrayFieldType(),
  },
  {
    sequelize,
    modelName: 'Team',
    tableName: 'teams',
    timestamps: true,
  }
);

export default Team;
