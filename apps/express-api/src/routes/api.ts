import express, {NextFunction, Request, Response, Router} from "express";
import Database from "../db";
import * as crypto from "node:crypto";

const router: Router = express.Router();
const authRouter = express.Router()
const profileRouter = express.Router()
const articleRouter = express.Router()
const eventRouter = express.Router()
const db = Database.getInstance();


/* TODO
 *   Add DB logic to routes
 *   Add Auth middlewares
 *   ? Split routers in separate files
 *   Error handling
 */

enum idType {
  Article,
  Event,
  User,
}

function generateId(type: idType) {
  if (type === idType.Article)
    return "A-" + crypto.randomInt(10000) + Date.now()
  else if (type === idType.Event)
    return "E-" + crypto.randomInt(10000) + Date.now()
  else if (type === idType.User)
    return crypto.randomInt(10000) + Date.now()

}

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  //Auth middleware | Checks if user is authenticated and provides valid token
  console.debug(req.header("Authorization"))
  if (req.header("Authorization") === undefined) {
    res.status(401).send({message: "Unauthorized"})
    return;
  }
  //TODO check if token is valid
  next();
}
// TODO Authorization middleware | Will check if user is authorized to access the resource

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
  .use("/auth/", authRouter)
  .use("/profile/", profileRouter)
  .use("/article/", articleRouter)
  .use("/events/", eventRouter)
  .use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res
      .status(500)
      .send({message: err.message ? err.message : 'Something broke!'});
  })


//Auth routes
authRouter
  .post('/login', (req: Request, res: Response) => {
    const {username, password} = req.body;
    if (!username || !password) {
      res.status(400).send({message: 'Missing username or password'});
      return;
    }
    const isValid = true;
    if (!isValid) {
      res.status(403).send({message: 'Invalid password'});
      return;
    }
    res.status(200).send({message: 'Login successful'});
  })
  .post('/register', async (req: Request, res: Response) => {
    const {username, password} = req.body;
    if (!username || !password) {
      res.status(400).send({message: 'Missing username or password'});
      return;
    }
    //TODO DB STUFF

    res.status(201);
  })
  .get("/test", (req: Request, res: Response) => {
    res.send({message: "Auth Router works"})
  })
//Profile routes
profileRouter.use(requireAuth)
profileRouter
  .get('/', (req: Request, res: Response) => {
    db.query('SELECT * FROM User').then((result) => {
      res.send(result);
    }).catch((err) => {
      res.status(500).send({message: 'Error fetching users'});
    })
  })
  .get('/:username', (req: Request, res: Response) => {
    db.query('SELECT * FROM User WHERE uid = ?', [req.params.username]).then((result) => {
      if (result.length === 0) {
        res.status(404).send({message: 'User not found'});
        return;
      }
      res.send({message: 'User found!'});
      res.send(result[0]);
    }).catch((err) => {
      res.status(500).send({message: 'Error fetching user'});
    })
  })
  .post('/', (req: Request, res: Response) => {
    const id = generateId(idType.User)
    db.query('INSERT INTO User (uid, username, password, email, role, activated) VALUES (?, ?, ?, ?, ?, ?)',
      [id, req.body.username, req.body.password, req.body.email, req.body.role, req.body.activated]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(500).send({message: 'Error creating user'});
        return;
      }
      res.status(201).send({message: 'User created'});
    }).catch((err) => {
      res.status(500).send({message: 'Error creating user'});
    })
  })
  .put('/:username', (req: Request, res: Response) => {
    db.query('UPDATE User SET username = ?, password = ?, email = ?, role = ?, activated = ? WHERE uid = ?',
      [req.body.username, req.body.password, req.body.email, req.body.role, req.body.activated, req.params.username]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send({message: 'User not found'});
        return;
      }
      res.send({message: 'User updated'});
    }).catch((err) => {
        res.status(500).send({message: 'Error updating user'});
      }
    )
  })
  .delete('/:username', (req: Request, res: Response) => {
    db.query('DELETE FROM User WHERE uid = ?', [req.params.username]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send({message: 'User not found'});
        return;
      }
      res.send({message: 'User deleted'});
    }).catch((err) => {
      res.status(500).send({message: 'Error deleting user'});
    })
  });
//Article routes
articleRouter
  .get('/', (req: Request, res: Response) => {
    db.query('SELECT * FROM Article').then((result) => {
      res.send(result);
    }).catch((err) => {
      res.status(500).send({message: 'Error fetching articles'});
    })
  })
  .get('/:id', (req: Request, res: Response) => {
    db.query('SELECT * FROM Article WHERE uid = ?', [req.params.id]).then((result) => {
      if (result.length === 0) {
        res.status(404).send({message: 'Article not found'});
        return;
      }
      res.send(result[0]);
    }).catch((err) => {
      res.status(500).send({message: 'Error fetching article'});
    })
  })
  .post('/', (req: Request, res: Response) => {
    const id = generateId(idType.Article)
    db.query('INSERT INTO Article (uid, title, content, subtitle, author, media, userUid) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, req.body.title, req.body.content, req.body.subtitle, req.body.author, req.body.media, req.body.userUid]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(500).send({message: 'Error creating article'});
        return;
      }
      res.status(201).send({message: 'Article created'});
    }).catch((err) => {
      res.status(500).send({message: 'Error creating article'});
    })
  })
  .put('/:id', (req: Request, res: Response) => {
    db.query('UPDATE Article SET title = ?, content = ?, subtitle = ?, author = ?, media = ?, userUid = ? WHERE uid = ?',
      [req.body.title, req.body.content, req.body.subtitle, req.body.author, req.body.media, req.body.userUid, req.params.id]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send({message: 'Article not found'});
        return;
      }
      res.send({message: 'Article updated'});
    }).catch((err) => {
      res.status(500).send({message: 'Error updating article'});
    })
  })
  .delete('/:id', (req: Request, res: Response) => {
    db.query('DELETE FROM Article WHERE uid = ?', [req.params.id]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send({message: 'Article not found'});
        return;
      }
      res.send({message: 'Article deleted'});
    }).catch((err) => {
      res.status(500).send({message: 'Error deleting article'});
    })
  });
//Event routes
eventRouter
  .get('/', (req: Request, res: Response) => {
    res.send({message: 'Event works!'});
  })
  .get('/:id', (req: Request, res: Response) => {
    res.send({message: 'Event works!'});
  })
  .post('/', (req: Request, res: Response) => {
    res.send({message: 'Event works!'});
  })
  .put('/:id', (req: Request, res: Response) => {
    res.send({message: 'Event works!'});
  })
  .delete('/:id', (req: Request, res: Response) => {
    res.send({message: 'Event works!'});
  });
//General Api routes
router
  .get('/', (req: Request, res: Response) => {
    res.send({message: 'Express API Works!'});
  })
  .get('/hello', (req: Request, res: Response) => {
    res.send({message: 'Hello World!'});
  })
  .get('/*', (req: Request, res: Response) => {
    res.status(404).send({message: 'Not Found'});
  });


export default router;
