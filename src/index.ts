// Imports
import http from 'http';
import si from 'systeminformation';
import { ISystemInformation } from './interface';

/**
 * Function that fetches all data
 * @returns An object with all fetched data
 */
export const getSystemInfo = async (): Promise<ISystemInformation> => {
  const sysInfo: ISystemInformation = {
    cpu: undefined,
    system: undefined,
    mem: undefined,
    os: undefined,
    currentLoad: undefined,
    processes: undefined,
    diskLayout: [],
    networkInterfaces: []
  }

  // Fetch data & modify object
  const [var_cpu, var_system, var_mem, var_os, var_currentLoad, var_processes, var_diskLayout, var_networkInterfaces] = await Promise.all([
    si.cpu(),
    si.system(),
    si.mem(),
    si.osInfo(),
    si.currentLoad(),
    si.processes(),
    si.diskLayout(),
    si.networkInterfaces()
  ]);

  sysInfo.cpu = var_cpu;
  sysInfo.system = var_system;
  sysInfo.mem = var_mem;
  sysInfo.os = var_os;
  sysInfo.currentLoad = var_currentLoad;
  sysInfo.processes = var_processes;
  sysInfo.diskLayout = var_diskLayout;
  sysInfo.networkInterfaces = var_networkInterfaces;

  return sysInfo;
}

// Create a server object:
export const createMyServer = () => {
  return http.createServer(async function (req, res) {
    // App only responds to http://localhost/api/v1/sysinfo
    if (req.url === "/api/v1/sysinfo") {
      const data = await getSystemInfo();
      res.write(JSON.stringify(data, null, 5));
    }
    // Return 404 error else
    else {
      res.statusCode = 404;
      res.statusMessage = "Wrong url";
      res.write("bruh");
    }
    // End request
    res.end();
    });
}

export function startMyServer(server: http.Server) {
// Start server
server.listen(8000); // the server object listens on port 8000;
}
