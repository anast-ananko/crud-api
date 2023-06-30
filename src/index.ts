import http from 'http';
import { config } from 'dotenv';

config();

const port = process.env.PORT || 5000;
console.log(process.env.PORT);

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
