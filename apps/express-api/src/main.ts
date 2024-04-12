import express from 'express';
import { NextFunction, Request, Response } from "express";

import * as path from 'path';
import * as process from "process";
import * as argon2 from "@node-rs/argon2";
import serverLess from 'serverless-http';

const app = express();
const router = express.Router();

router.use(express.json());
router.use((req: Request, res:Response, next: NextFunction) => {
  res.appendHeader('Access-Control-Allow-Origin', '*');
  next();
})
router.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Express API Work!' });
});
router.get('/hello', (req: Request, res: Response) => {
  res.send({ message: 'Hello World!' });
});

router.post('/login', (req: Request, res: Response) => {
  const {username, password} = req.body;
  if (!username || !password) {
    res.status(400).send({message: 'Missing username or password'})
    return;
  }
  //TODO DB STUFF
  const isValid = argon2.verify(password, 'HASH_FROM_DB')
  if (!isValid) {
    res.status(403).send({message: 'Invalid password'})
    return;
  }
  res.status(200).send({message: 'Login successful'})
})
router.post('/register', async (req: Request, res: Response) => {
  const {username, password} = req.body;
  if (!username || !password) {
    res.status(400).send({message: 'Missing username or password'})
    return;
  }
  const hash = await argon2.hash(password)
  //TODO DB STUFF

  res.status(201)
})
router.get('/error', (req: Request, res:Response, next: NextFunction) => {
  next(new Error('Test error'));
});
router.get('/*', (req: Request, res: Response) => {
  res.status(404).send({ message: 'Not Found' });
});

router.use((err : Error, req: Request, res:Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({message: err.message ? err.message : 'Something broke!'});
})

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/', router);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

export const handler = serverLess(app);
