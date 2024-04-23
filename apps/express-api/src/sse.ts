import { NextFunction, Request, Response } from 'express';

export interface SSEResponse extends Response {
  sseConnection: Response;
}

export const sseConnections: SSEResponse[] = [];

function SSESetup(res: SSEResponse) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-accel-buffering', 'no');

  res.on('close', () => {
    res.end();
  });
  this.res = res;
}

SSESetup.prototype.send = function (data, eventId = 'message') {
  this.res.write(`event: ${eventId}\n`);
  this.res.write(`id: ${Date.now()}\n`);
  this.res.write(`data: ${JSON.stringify(data)}\n\n`);
};

export function sseMiddleware(
  req: Request,
  res: SSEResponse,
  next: NextFunction,
) {
  res.sseConnection = new SSESetup(res);
  sseConnections.push(res);
  return next();
}
