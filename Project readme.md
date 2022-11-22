# Cloud programming
> Sam Nzongani 
> ENSTA Bretagne - CSN 2023

## Questions
---

### 1. Environment
I chose to use Windows as my environment since I already had node installed on it.

### 2. Package files
The file ``package.json`` contains info about:
- the project (name, author, github url, dependencies versions...)
- script commands (describe commands to execute with specified names)

The file ``package-lock.json`` contains info about all the node modules installed:
- version
- url
- integrity code
- other dependencies...

### 3. System information
Install the [systeminformation](https://www.npmjs.com/package/systeminformation) module:

```
npm i systeminformation
```

If successfully installed, it is added to the ``package*.json`` files:

For example in ``package.json``:

```
  "dependencies": {
    "systeminformation": "^5.12.13"
  }
```

The file contains (among others) the fields **dependencies** and **devDependencies**.
The first one lists the installed modules *for the app to use*.
The second lists the development modules used to *build the app*.

### 4. App code

The code for the app is distributed in 2 files:
- index.ts
- interface.ts

The first one contains the code responsible for the app logic (create http server, handle requests & get system information). System information is retrieved with the **getSystemInfo** function.
```typescript
// Create a server object:
http.createServer(function (req, res) {
  // App only responds to http://localhost/api/v1/sysinfo
  if (req.url === "/api/v1/sysinfo") {
    const data = getSystemInfo();
  }
  // Return 404 error else
  else {
    res.statusCode = 404;
    res.statusMessage = "Wrong url";
  }
  // End request
  res.end();
  })
  .listen(8000); // the server object listens on port 8080
```
Since the [functions](https://systeminformation.io/) used to fetch data are asynchronous I chained all calls to retrieve data so that a data is fetched when the previous one has been retrieved.
This way we are certain to have all wanted information inside our ``sysInfo`` variable.
```typescript
// Fetch data & modify object
  await si.cpu().then((data => sysInfo.cpu = data))
    .catch(error => console.error(error))
  .then(() => si.system()).then((data => sysInfo.system = data))
    .catch(error => console.error(error))
  .then(() => si.mem()).then((data => sysInfo.mem = data))
    .catch(error => console.error(error))
  .then(() => si.osInfo()).then((data => sysInfo.os = data))
    .catch(error => console.error(error))
  .then(() => si.currentLoad()).then((data => sysInfo.currentLoad = 
    data))
    .catch(error => console.error(error))
  .then(() => si.processes()).then((data => sysInfo.processes = data))
    .catch(error => console.error(error))
  .then(() => si.diskLayout()).then((data => sysInfo.diskLayout = 
    data))
    .catch(error => console.error(error))
  .then(() => si.networkInterfaces()).then((data => 
    sysInfo.networkInterfaces = data))
    .catch(error => console.error(error))
  .finally(() => {
    console.log(sysInfo);
    return sysInfo;
  })
```
The second file only contains the interface defining the data we are fetching:
```typescript
interface ISystemInformation {
    cpu: si.Systeminformation.CpuData;
    system: si.Systeminformation.SystemData;
    mem: si.Systeminformation.MemData;
    os: si.Systeminformation.OsData;
    currentLoad: si.Systeminformation.CurrentLoadData;
    processes: si.Systeminformation.ProcessesData;
    diskLayout: si.Systeminformation.DiskLayoutData[];
    networkInterfaces: si.Systeminformation.NetworkInterfacesData[];
}
```

### 5. Curl test
With the command ``curl http://localhost:8000/api/v1/sysinfo`` we get:
```JSON
system: {
    manufacturer: 'ASUSTeK COMPUTER INC.',
    model: 'VivoBook_ASUSLaptop X571GT_A571GT',
    version: '1.0',
    serial: 'L7N0CX014414276',
    uuid: '256b4525-94f4-574f-a0bc-dbeadc79f659',
    sku: '',
    virtual: false
  },
  mem: {
    total: 8435277824,
    free: 1415364608,
    used: 7019913216,
    active: 7019913216,
    available: 1415364608,
    buffers: 0,
    cached: 0,
    slab: 0,
    buffcache: 0,
    swaptotal: 7247757312,
    swapused: 717225984,
    swapfree: 6530531328
  }
```
The data retrieved is way bigger and includes all properties defined in the interface which is why I only gave **system** and **mem** as an example above.

A request to ``http://localhost:8000`` returns the following:
```powershell
curl : Le serveur distant a retourné une erreur: (404) 
Introuvable.
Au caractère Ligne:1 : 1
+ curl http://localhost:8000
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation : (System.Net.Http  
   WebRequest:HttpWebRequest) [Invoke-WebRequest], WebException    
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Micro  
   soft.PowerShell.Commands.InvokeWebRequestCommand
```

The formalism used to build the API url allows different versions *(v1, v2, ...)* that could each point toward different information. It gives developpers some freedom.
### 6. Jest testing ![[file-type-jest.svg|20]]
Jest is a JavaScript testing framework.
The file **.jestrc.json** indicates that tests are written in **index.spec.ts**:
```JSON
{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "testMatch": ["**/*.spec.ts"]
}
```

#### Tests
#### Results

## Docker
Build image
```shell
docker build -t sysinfo-api:0.0.1 .
```
Run image
```shell
docker run -p 8123:8000 -m1024m --cpus=1 sysinfo-api:0.0.1
```
Tag
```shell
docker tag sysinfo-api:0.0.1 samnzo/sysinfo-api:0.0.1
```
Push
```shell
docker push samnzo/sysinfo-api:0.0.2
```
Pull from hub
```shell
docker pull samnzo/sysinfo-api:0.0.1
```
