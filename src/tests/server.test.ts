import request from 'supertest';

import { server } from '../index';

const user = {
  username: 'Anna',
  age: 22,
  hobbies: ['books'],
};

const updatedUser = {
  username: 'Anna',
  age: 22,
  hobbies: ['swimming'],
};

const invalidUser1 = {
  username: 'Anna',
  hobbies: ['swimming'],
};

const invalidUser2 = {
  username: 'Anna',
  age: 22,
  hobbies: [33333],
};

let userId = '';
const invalidUserId = '111';

describe('Scenario 1', () => {
  afterAll(() => {
    server.close();
  });

  it('should return empty array and status 200', async () => {
    const response = await request(server).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return created new user and status 201', async () => {
    const response = await request(server).post('/api/users').send(JSON.stringify(user));

    userId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: response.body.id, ...user });
  });

  it('should return user and status 200', async () => {
    const response = await request(server).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: userId, ...user });
  });

  it('should return updated user and status 200', async () => {
    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send(JSON.stringify(updatedUser));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: userId, ...updatedUser });
  });

  it('should return status 204 when user was successfully deleted', async () => {
    const response = await request(server).delete(`/api/users/${userId}`);

    expect(response.status).toBe(204);
  });

  it('should return status 404 when user does not exist', async () => {
    const response = await request(server).get(`/api/users/${userId}`);

    expect(response.status).toBe(404);
  });
});

describe('Scenario 2: Check get request with invalid userId (not uuid)', () => {
  afterAll(() => {
    server.close();
  });

  it('should return empty array and status 200', async () => {
    const response = await request(server).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return created new user and status 201', async () => {
    const response = await request(server).post('/api/users').send(JSON.stringify(user));

    userId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: response.body.id, ...user });
  });

  it('should return status 400 when invalid userId', async () => {
    const response = await request(server).get(`/api/users/${invalidUserId}`);

    expect(response.status).toBe(400);
  });

  it('should return status 204 when user was successfully deleted', async () => {
    const response = await request(server).delete(`/api/users/${userId}`);

    expect(response.status).toBe(204);
  });
});

describe('Scenario 3: Check put request with invalid userId (not uuid) and when user does not exist', () => {
  afterAll(() => {
    server.close();
  });

  it('should return empty array and status 200', async () => {
    const response = await request(server).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return status 400 when invalid userId', async () => {
    const response = await request(server)
      .put(`/api/users/${invalidUserId}`)
      .send(JSON.stringify(updatedUser));

    expect(response.status).toBe(400);
  });

  it('should return status 404 when user does not exist', async () => {
    const response = await request(server)
      .put(`/api/users/${userId.slice(0, -2).concat('11')}`)
      .send(JSON.stringify(updatedUser));

    expect(response.status).toBe(404);
  });
});

describe('Scenario 4: Checking for requirements such as the body must contain required fields and array of hobbies must contain only strings', () => {
  afterAll(() => {
    server.close();
  });

  it('should return empty array and status 200', async () => {
    const response = await request(server).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return status 400 when body does not contain required fields', async () => {
    const response = await request(server).post('/api/users').send(JSON.stringify(invalidUser1));

    expect(response.status).toBe(400);
  });

  it('should return status 400 when array of hobbies contains not only strings', async () => {
    const response = await request(server).post('/api/users').send(JSON.stringify(invalidUser2));

    expect(response.status).toBe(400);
  });
});

describe('Scenario 5: Trying to do a request to non-existing endpoint', () => {
  afterAll(() => {
    server.close();
  });

  it('should return status 404', async () => {
    const response = await request(server).get('/bla-bla');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Invalid endpoint');
  });
});

describe('Scenario 6: Trying to do a unsupported operation', () => {
  afterAll(() => {
    server.close();
  });

  it('should return status 404', async () => {
    const response = await request(server).options('/api/users');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Unsupported operation');
  });
});
