import express, {Request, Response} from 'express';

import * as path from 'path';
import * as process from 'process';
import router from "./routes/api";
import serverLess from 'serverless-http';
import {sseConnections, sseMiddleware, SSEResponse} from './sse';

import {initializeApp} from 'firebase-admin/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAQ2p-heYZkI-vhLOuEoZB3dtLnM-Xcd_Y',
  authDomain: 'hsb-dbweb.firebaseapp.com',
  projectId: 'hsb-dbweb',
  storageBucket: 'hsb-dbweb.appspot.com',
};
const firebase = initializeApp(firebaseConfig);

const app = express();

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

export const handler = serverLess(app);

app
  .use('/api/', router)
  .use('/assets', express.static(path.join(__dirname, 'assets')));

//App routes

app
  .get('/events', sseMiddleware, (req: Request, res: SSEResponse) => {
    res.sseConnection.send({message: 'Welcome to the SSE connection'});
  })
  .get('/hello', (req: Request, res: Response) => {
    sseConnections.forEach((sseRes) => {
      sseRes.sseConnection.send({
        message: 'Ping from /hello',
        time: Date.now(),
      });
    });
    res.send({message: 'Hello World!'});
  });



