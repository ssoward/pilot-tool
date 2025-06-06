import { Request, Response } from 'express';
import Employee from '../models/Employee';
import sequelize from '../config/database';
import { Op } from 'sequelize';

/**
 * Controller for handling Employee-related operations
 */
export const employeeController = {
  /**
   * Get all employees with optional filtering
   */
  getAllEmployees: async (req: Request, res: Response): Promise<void> => {
    try {
      const { role, search } = req.query;
      
      let whereClause: any = {};
      
      // Filter by role if provided
      if (role) {
        whereClause.role = role;
      }
      
      // Search by name if provided
      if (search) {
        const searchStr = String(search).toLowerCase();
        whereClause = {
          ...whereClause,
          [Op.or]: [
            sequelize.where(
              sequelize.fn('lower', sequelize.col('firstName')),
              'LIKE',
              `%${searchStr}%`
            ),
            sequelize.where(
              sequelize.fn('lower', sequelize.col('lastName')),
              'LIKE',
              `%${searchStr}%`
            )
          ]
        };
      }
      
      const employees = await Employee.findAll({
        where: whereClause,
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });
      
      res.json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  /**
   * Get employee by ID
   */
  getEmployeeById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      
      res.json(employee);
    } catch (error) {
      console.error('Error fetching employee:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  /**
   * Create a new employee
   */
  createEmployee: async (req: Request, res: Response): Promise<void> => {
    try {
      const employeeData = req.body;
      
      // Validate required fields
      if (!employeeData.firstName || !employeeData.lastName || !employeeData.hrEmpId) {
        res.status(400).json({ message: 'First name, last name, and HR Employee ID are required' });
        return;
      }
      
      const employee = await Employee.create(employeeData);
      
      res.status(201).json(employee);
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  /**
   * Update an employee
   */
  updateEmployee: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const employeeData = req.body;
      
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      
      await employee.update(employeeData);
      
      res.json(employee);
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  /**
   * Delete an employee
   */
  deleteEmployee: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const employee = await Employee.findByPk(id);
      
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
        return;
      }
      
      await employee.destroy();
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export default employeeController;
