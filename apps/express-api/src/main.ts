import express, {Request, Response} from 'express';

import * as path from 'path';
import * as process from 'process';
import router from './routes/api';
import {sseConnections, sseMiddleware, SSEResponse} from './sse';

import compression from 'compression';

const app = express();

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});


// app.options('*', cors())

app
  // .use(cors())
  .use(compression())
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
        time: Date.now()
      });
    });
    res.send({message: 'Hello World!'});
  })
  .get('/ping', (req: Request, res: Response) => {
    sseConnections.forEach((sseRes) => {
      sseRes.sseConnection.send({});
    });
  });



