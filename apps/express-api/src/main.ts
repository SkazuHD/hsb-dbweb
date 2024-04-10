import express from 'express';
import { NextFunction, Request, Response } from "express";

import * as path from 'path';
import * as process from "process";
import * as argon2 from "@node-rs/argon2";

const app = express();
app.use(express.json());



app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use((err : Error, req: Request, res:Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({message: err.message ? err.message : 'Something broke!'});
})
app.use((req: Request, res:Response, next: NextFunction) => {
  res.appendHeader('Access-Control-Allow-Origin', '*');
  next();
})
app.get('/api', (req: Request, res: Response) => {
  console.log(res.getHeaders())
  res.send({ message: 'Express API Work!' });
});

app.post('/api/login', (req: Request, res: Response) => {
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
app.post('/api/register', async (req: Request, res: Response) => {
  const {username, password} = req.body;
  if (!username || !password) {
    res.status(400).send({message: 'Missing username or password'})
    return;
  }
  const hash = await argon2.hash(password)
  //TODO DB STUFF

  res.status(201)
})
app.get('/api/error', (req: Request, res:Response, next: NextFunction) => {
  next(new Error('Test error'));
});
app.get('/api/*', (req: Request, res: Response) => {
  res.status(404).send({ message: 'Not Found' });
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});


