import http, { Server, IncomingMessage, ServerResponse } from 'http';
import { config } from 'dotenv';
import cluster, { Worker } from 'cluster';
import os from 'os';

import { dbServer } from './serverDB';
import { router } from './router';
import Database from './db';

config();

let server: Server;
export const users = new Database();

const port = process.env.PORT || 5000;
//const dbPort = 4000;

const numCPUs = os.cpus().length;

const workers: Worker[] = [];

if (process.env.MODE === 'cluster') {
  if (cluster.isPrimary) {
    //dbServer.listen(dbPort);

    for (let i = 0; i < numCPUs - 1; i++) {
      const worker = cluster.fork();
      workers.push(worker);
    }

    let currentWorkerIndex = 0;

    const balancer = (req: IncomingMessage, res: ServerResponse) => {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const worker = workers[currentWorkerIndex];
        currentWorkerIndex = (currentWorkerIndex + 1) % (numCPUs - 1);

        const requestToWorker = http.request(
          {
            port: +port + worker.id,
            method: req.method,
            path: req.url,
            headers: { 'Content-Type': 'application/json' },
          },
          (responseFromWorker) => {
            let dataFromWorker = '';

            responseFromWorker.on('data', (chunk) => {
              dataFromWorker += chunk;
            });

            responseFromWorker.on('end', () => {
              res.statusCode = responseFromWorker.statusCode || 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(dataFromWorker);
            });
          }
        );

        requestToWorker.on('error', (e) => {
          console.error(e);
        });

        requestToWorker.write(body);
        requestToWorker.end();
      });
    };

    http.createServer(balancer).listen(port, () => {
      console.log(`Balancer #${process.pid} is running on port ${port}`);
    });

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
      const index = workers.indexOf(worker);

      if (index !== -1) {
        workers.splice(index, 1);
      }

      const newWorker = cluster.fork();
      workers.push(newWorker);
    });
  } else {
    const server = http.createServer((req, res) => {
      router(req, res);
      console.log(`Worker #${process.pid} received request`);
    });

    const port = 3000 + cluster!.worker!.id;

    server.listen(port, () => {
      console.log(`Worker #${process.pid} is running on port ${port}`);
    });
  }
} else {
  //dbServer.listen(dbPort);

  const server = http.createServer((req, res) => {
    router(req, res);
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export { server };
