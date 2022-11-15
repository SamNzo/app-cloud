// Imports
import http from 'http';
import si from 'systeminformation';
import { ISystemInformation } from './interface';

/**
 * Mandatory Hello World function.
 * @returns A string which contains "Hello world!"
 */
 export const helloWorld = (): string => {
  return 'Hello world!';
};

/**
 * Function that fetches all data
 * @returns An object with all fetched data
 */
export const getSystemInfo = async (): Promise<ISystemInformation> => {
  let sysInfo: ISystemInformation = {
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
  await si.cpu().then((data => sysInfo.cpu = data))
    .catch(error => console.error(error))
  .then(() => si.system()).then((data => sysInfo.system = data))
    .catch(error => console.error(error))
  .then(() => si.mem()).then((data => sysInfo.mem = data))
    .catch(error => console.error(error))
  .then(() => si.osInfo()).then((data => sysInfo.os = data))
    .catch(error => console.error(error))
  .then(() => si.currentLoad()).then((data => sysInfo.currentLoad = data))
    .catch(error => console.error(error))
  .then(() => si.processes()).then((data => sysInfo.processes = data))
    .catch(error => console.error(error))
  .then(() => si.diskLayout()).then((data => sysInfo.diskLayout = data))
    .catch(error => console.error(error))
  .then(() => si.networkInterfaces()).then((data => sysInfo.networkInterfaces = data))
    .catch(error => console.error(error))

  return sysInfo;
}

// Create a server object:
http.createServer(async function (req, res) {
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
  })
  .listen(8000); // the server object listens on port 8080



