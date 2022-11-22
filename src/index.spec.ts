import { createMyServer, getSystemInfo, startMyServer, closeMyServer } from './server';
import fetch from 'node-fetch';

// Increase timeout duration
jest.setTimeout(20000);
// Create server
const server = createMyServer();
// Choose port number
const port: number = 8100;


describe('sysinfo api test', () => {
  // Before tests start
  beforeAll(() => {
    // Start server
    startMyServer(server, port);
  })
  // After tests end
  afterAll(() => {
    // Close server
    closeMyServer(server);
  })
  it('should return 200 status with right url', async () => {
    const response = await fetch(`http://localhost:${port}/api/v1/sysinfo`, {method: 'GET'});
    expect(response.status).toBe(200);
  });
  it('should return 404 error with wrong url', async () => {
    const response = await fetch(`http://localhost:${port}`, {method: 'GET'});
    expect(response.status).toBe(404);
  });
  it('should have all required fields', async () => {
    const data = await getSystemInfo();
    expect(data).toHaveProperty('cpu');
    expect(data).toHaveProperty('system');
    expect(data).toHaveProperty('mem');
    expect(data).toHaveProperty('os');
    expect(data).toHaveProperty('currentLoad');
    expect(data).toHaveProperty('processes');
    expect(data).toHaveProperty('diskLayout');
    expect(data).toHaveProperty('networkInterfaces');
    expect(data).not.toHaveProperty('osInfo');
  })
});

