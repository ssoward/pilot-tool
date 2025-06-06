import request from 'supertest';
import app from '../index';
import sequelize from '../config/database';
import Team from '../models/Team';

describe('Team API Endpoints', () => {
  const testTeam = {
    teamId: 9999,
    teamName: 'Test Team',
    teamDescription: 'A team for testing',
    jiraProjectId: 12345,
    jiraBoardId: 54321,
    teamBacklogLabel: 'TEST-BACKLOG',
    teamNotificationSettings: null,
    empCount: 5,
    orgUnitId: 1,
    orgUnitName: 'Test Org',
  };

  beforeAll(async () => {
    await sequelize.sync();
    await Team.create(testTeam);
  });

  afterAll(async () => {
    await Team.destroy({ where: { teamId: testTeam.teamId } });
    await sequelize.close();
  });

  it('should get all teams', async () => {
    const res = await request(app).get('/api/teams');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t: any) => t.teamName === 'Test Team')).toBe(true);
  });

  it('should get a team by ID', async () => {
    const res = await request(app).get(`/api/teams/${testTeam.teamId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.teamName).toBe('Test Team');
  });

  it('should create a new team', async () => {
    const newTeam = { ...testTeam, teamId: 9998, teamName: 'New Team' };
    const res = await request(app).post('/api/teams').send(newTeam);
    expect(res.statusCode).toBe(201);
    expect(res.body.teamName).toBe('New Team');
    // Cleanup
    await Team.destroy({ where: { teamId: 9998 } });
  });

  it('should update a team', async () => {
    const res = await request(app)
      .put(`/api/teams/${testTeam.teamId}`)
      .send({ teamDescription: 'Updated description' });
    expect(res.statusCode).toBe(200);
    expect(res.body.teamDescription).toBe('Updated description');
  });

  it('should delete a team', async () => {
    const tempTeam = await Team.create({ ...testTeam, teamId: 9997, teamName: 'Delete Me' });
    const res = await request(app).delete(`/api/teams/${tempTeam.teamId}`);
    expect(res.statusCode).toBe(204);
    const getRes = await request(app).get(`/api/teams/${tempTeam.teamId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
