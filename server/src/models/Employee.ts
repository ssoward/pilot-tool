import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

/**
 * Employee model representing employees from employees.json
 * Based on the actual data structure in the JSON file
 */
class Employee extends Model {
  public id!: number;
  public hrEmpId!: number;
  public parentPath!: string;
  public firstName!: string;
  public lastName!: string;
  public grade!: number;
  public mgrHrEmpId!: number;
  public mgrName!: string;
  public role!: string;
  public cisIdPresentFlag!: boolean;
  public pilotUserFlag!: boolean;
  public attritionFlag!: boolean;
  public externalFlag!: boolean;
  public creatorFlag!: boolean;
  public approverFlag!: boolean;
  public leadFlag!: boolean;
  public attritionDate!: Date | null;
  public notificationSettings!: string | null;
  public endDate!: number;
  public employeeType!: number;
  public employeeTypeName!: string | null;
  public canViewHrData!: boolean;
  
  // Helper methods
  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Association properties
  public assignments?: any[];
  public teams?: any[];
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hrEmpId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    parentPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mgrHrEmpId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    mgrName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cisIdPresentFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    pilotUserFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    attritionFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    externalFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    creatorFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    approverFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    leadFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    attritionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notificationSettings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    employeeType: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    employeeTypeName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    canViewHrData: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true,
    indexes: [
      { fields: ['hrEmpId'] },
      { fields: ['mgrHrEmpId'] },
      { fields: ['firstName', 'lastName'] },
    ]
  }
);

export default Employee;
