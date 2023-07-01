import http from 'http';
import { config } from 'dotenv';

import Database from './db';
import { router } from './router';

config();

export const users = new Database();

const port = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
