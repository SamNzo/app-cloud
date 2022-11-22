import http from 'http';
import { createMyServer, startMyServer } from "./server";

const server: http.Server = createMyServer();
const port: number = 8000;
startMyServer(server, port);

