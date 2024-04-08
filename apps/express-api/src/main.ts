/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import * as process from "process";
import * as argon2 from "@node-rs/argon2";

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.json());

app.use((req, res, next) => {
  res.appendHeader('Access-Control-Allow-Origin', '*');
  next();
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
})

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to express-api!' });
});

app.post('/api/login', (req, res) => {
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
app.post('/api/register', async (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    res.status(400).send({message: 'Missing username or password'})
    return;
  }
  const hash = await argon2.hash(password)
  //TODO DB STUFF

  res.status(201)
})

app.get('/api/*', (req, res) => {
  res.status(404).send({ message: 'Not Found' });
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
