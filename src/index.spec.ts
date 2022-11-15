import { createMyServer, getSystemInfo, startMyServer } from './index';
import fetch from 'node-fetch';


jest.setTimeout(20000);

describe('object system data test', () => {
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

describe('server test', () => {
  it('should return 200 status with right url', async () => {
    const server = createMyServer();
    startMyServer(server);
    const response = await fetch('http://localhost:8000/api/v1/sysinfo', {method: 'GET'});
    expect(response.status).toEqual(200);
    server.close((err) => console.log(err));
  });
});

describe('server test', () => {
  it('should return 404 error with wrong url', async () => {
    const server = createMyServer();
    startMyServer(server);
    const response = await fetch('http://localhost:8000', {method: 'GET'});
    expect(response.status).toEqual(404);
    server.close((err) => console.log(err));
  });
});
