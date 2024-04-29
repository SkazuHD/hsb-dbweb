import express, { NextFunction, Request, Response } from 'express';

import * as path from 'path';
import * as process from 'process';
import serverLess from 'serverless-http';
import { sseConnections, sseMiddleware, SSEResponse } from './sse';
import * as db from  './db'

import { initializeApp } from 'firebase-admin/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAQ2p-heYZkI-vhLOuEoZB3dtLnM-Xcd_Y',
  authDomain: 'hsb-dbweb.firebaseapp.com',
  projectId: 'hsb-dbweb',
  storageBucket: 'hsb-dbweb.appspot.com',
};
const firebase = initializeApp(firebaseConfig);

const app = express();
const router = express.Router();

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  db.init()
});



export const handler = serverLess(app);

app
  .use('/api/', router)
  .use('/assets', express.static(path.join(__dirname, 'assets')));
router
  .use(express.json())
  .use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // replace with your Angular app's URL
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
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
    const isValid = true;
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
    //TODO DB STUFF

    res.status(201);
  })
  .get('/error', (req: Request, res: Response, next: NextFunction) => {
    next(new Error('Test error'));
  })
  .get('/*', (req: Request, res: Response) => {
    res.status(404).send({ message: 'Not Found' });
  });

