import express, { NextFunction, Request, Response } from 'express';

import * as path from 'path';
import * as process from 'process';
//import * as argon2 from "@node-rs/argon2";
import serverLess from 'serverless-http';
import { sseConnections, sseMiddleware, SSEResponse } from './sse';

const app = express();
const router = express.Router();

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

export const handler = serverLess(app);

app
  .use('/api/', router)
  .use('/assets', express.static(path.join(__dirname, 'assets')));
router
  .use(express.json())
  .use((req: Request, res: Response, next: NextFunction) => {
    res.appendHeader('Access-Control-Allow-Origin', '*');
    //res.flushHeaders();
    next();
  })
  .use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res
      .status(500)
      .send({ message: err.message ? err.message : 'Something broke!' });
  });
//App routes

app
  .get('/events', sseMiddleware, (req: Request, res: SSEResponse) => {
    res.sseConnection.send({ message: 'Welcome to the SSE connection' });
  })
  .get('/hello', (req: Request, res: Response) => {
    sseConnections.forEach((sseRes) => {
      sseRes.sseConnection.send({
        message: 'Ping from /hello',
        time: Date.now(),
      });
    });
    res.send({ message: 'Hello World!' });
  });

//API routes
router
  .get('/', (req: Request, res: Response) => {
    res.send({ message: 'Express API Work!' });
  })
  .get('/hello', (req: Request, res: Response) => {
    res.send({ message: 'Hello World!' });
  })
  .post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send({ message: 'Missing username or password' });
      return;
    }
    //TODO DB STUFF
    const isValid = true; //argon2.verify(password, 'HASH_FROM_DB')
    if (!isValid) {
      res.status(403).send({ message: 'Invalid password' });
      return;
    }
    res.status(200).send({ message: 'Login successful' });
  })
  .post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send({ message: 'Missing username or password' });
      return;
    }
    //const hash = await argon2.hash(password)
    //TODO DB STUFF

    res.status(201);
  })
  .get('/error', (req: Request, res: Response, next: NextFunction) => {
    next(new Error('Test error'));
  })
  .get('/*', (req: Request, res: Response) => {
    res.status(404).send({ message: 'Not Found' });
  });
