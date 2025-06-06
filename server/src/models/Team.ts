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
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    };
  }
};

class Team extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public managerId!: string;
  public managerName!: string;
  public capacity!: number;
  public currentWorkload!: number;
  public skills!: string[];
  public memberCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association properties
  public members?: any[];
  public assignments?: any[];
}

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
      type: DataTypes.UUID,
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
    skills: {
      ...getArrayFieldType(),
      allowNull: false
    },
    memberCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Team',
    tableName: 'teams',
    timestamps: true,
  }
);

export default Team;
