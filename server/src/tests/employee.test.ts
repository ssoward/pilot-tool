import request from 'supertest';
import app from '../src/index'; // Adjust path to your Express app
import sequelize from '../src/config/database';
import Employee from '../src/models/Employee';

beforeAll(async () => {
  // await sequelize.sync({ force: true }); // Use this to reset DB for each test run
  // For now, let's assume seeding is handled separately or not strictly needed for all tests
  // Or, seed specific data needed for tests:
  await Employee.bulkCreate([
    { id: 'test-emp-1', hrEmpId: '12345', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'Engineer', employeeType: 'Full-time', isActive: true },
    { id: 'test-emp-2', hrEmpId: '67890', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', role: 'Manager', employeeType: 'Full-time', isActive: true },
    { id: 'test-emp-inactive', hrEmpId: '11223', firstName: 'Inactive', lastName: 'User', email: 'inactive.user@example.com', role: 'Contractor', employeeType: 'Part-time', isActive: false },
  ]);
});

afterAll(async () => {
  await Employee.destroy({ where: { id: ['test-emp-1', 'test-emp-2', 'test-emp-inactive', 'new-emp-id'] } }); // Clean up test data
  await sequelize.close();
});

describe('Employee API Endpoints', () => {
  describe('GET /api/employees', () => {
    it('should return a list of employees', async () => {
      const res = await request(app).get('/api/employees');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThanOrEqual(2); // At least the two active seeded employees
      expect(res.body.some((emp: any) => emp.id === 'test-emp-1')).toBe(true);
    });

    it('should filter employees by role', async () => {
      const res = await request(app).get('/api/employees?role=Manager');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.every((emp: any) => emp.role === 'Manager')).toBe(true);
      expect(res.body.some((emp: any) => emp.id === 'test-emp-2')).toBe(true);
    });

    it('should filter employees by search term (firstName)', async () => {
      const res = await request(app).get('/api/employees?search=John');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.some((emp: any) => emp.firstName === 'John')).toBe(true);
    });

    it('should filter employees by search term (lastName)', async () => {
      const res = await request(app).get('/api/employees?search=Smith');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.some((emp: any) => emp.lastName === 'Smith')).toBe(true);
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return a single employee by ID', async () => {
      const res = await request(app).get('/api/employees/test-emp-1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', 'test-emp-1');
      expect(res.body).toHaveProperty('firstName', 'John');
    });

    it('should return 404 for a non-existent employee ID', async () => {
      const res = await request(app).get('/api/employees/non-existent-id');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const newEmployee = {
        id: 'new-emp-id',
        hrEmpId: '99999',
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@example.com',
        role: 'Tester',
        employeeType: 'Full-time',
        department: 'QA',
        costCenter: 'CC123',
        managerId: 'test-emp-2',
        isActive: true,
        isProductManager: false,
        isTeamLead: false,
        isEngineeringManager: false,
        isScrumMaster: false,
        isBusinessAnalyst: false,
        isArchitect: false,
        isUXDesigner: false,
        isTechnicalWriter: false,
        isDevOpsEngineer: false,
        isSecurityEngineer: false,
        isDataScientist: false,
        isQualityEngineer: true,
      };
      const res = await request(app)
        .post('/api/employees')
        .send(newEmployee);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id', 'new-emp-id');
      expect(res.body).toHaveProperty('firstName', 'Test');

      // Verify it was actually created
      const getRes = await request(app).get('/api/employees/new-emp-id');
      expect(getRes.statusCode).toEqual(200);
      expect(getRes.body).toHaveProperty('firstName', 'Test');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/employees')
        .send({ firstName: 'Test' }); // Missing lastName and hrEmpId
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update an existing employee', async () => {
      const updatedData = { firstName: 'Johnny', role: 'Senior Engineer' };
      const res = await request(app)
        .put('/api/employees/test-emp-1')
        .send(updatedData);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('firstName', 'Johnny');
      expect(res.body).toHaveProperty('role', 'Senior Engineer');
    });

    it('should return 404 when trying to update a non-existent employee', async () => {
      const res = await request(app)
        .put('/api/employees/non-existent-id')
        .send({ firstName: 'Nobody' });
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee', async () => {
      // First, create an employee to delete
      const tempEmployee = await Employee.create({
        id: 'temp-delete-emp',
        hrEmpId: '00000',
        firstName: 'Temporary',
        lastName: 'Delete',
        email: 'temp.delete@example.com',
        role: 'To Be Deleted',
        employeeType: 'Full-time',
        isActive: true,
      });

      const res = await request(app).delete(`/api/employees/${tempEmployee.id}`);
      expect(res.statusCode).toEqual(204);

      // Verify it was actually deleted
      const getRes = await request(app).get(`/api/employees/${tempEmployee.id}`);
      expect(getRes.statusCode).toEqual(404);
    });

    it('should return 404 when trying to delete a non-existent employee', async () => {
      const res = await request(app).delete('/api/employees/non-existent-id');
      expect(res.statusCode).toEqual(404);
    });
  });
});
