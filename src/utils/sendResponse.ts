import { ServerResponse } from 'http';

export const sendResponse = (res: ServerResponse, statusCode: number, message: string) => {
  if (res.headersSent) {
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = statusCode;
  res.end(JSON.stringify({ message }));
};
