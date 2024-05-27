import express, {NextFunction, Request, Response, Router} from "express";
import Database from "../db";
import * as crypto from "node:crypto";
import {Event} from "@hsb-dbweb/shared"

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

const requireAuthentication = (req: Request, res: Response, next: NextFunction) => {
  //Auth middleware | Checks if user is authenticated and provides valid token
  console.debug(req.header("Authorization"))
  if (req.header("Authorization") === undefined) {
    res.status(401).send({message: "Unauthorized"})
    return;
  }
  //TODO check if token is valid
  next();
}
const requireAuthorization = (req: Request, res: Response, next: NextFunction) => {
  // Authorization middleware | Will check if user is authorized to access the resource
  console.debug(req.header("Authorization"))
  if (req.header("Authorization") === undefined) {
    res.status(401).send({message: "Unauthorized"})
    return;

  }
  // TODO Decode JWT and check if user has the required role
  next();
}

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
profileRouter.use(requireAuthentication)
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
    let whereClause = "1=1 "
    if (req.query.type) whereClause += " AND type = '" + req.query.type + "'"
    if (req.query.date) whereClause += " AND date = '" + req.query.date + "'"
    if (req.query.location) whereClause += " AND location ='" + req.query.location + "'"

    if (req.query.upcoming) {
      const range = parseInt(req.query.upcoming[0]);
      const nowDate = new Date()
      const desiredDate = new Date(nowDate)
      desiredDate.setDate(nowDate.getDate() + range)
      const nowDateStr = nowDate.toISOString().split('T')[0]
      const desiredDateStr = desiredDate.toISOString().split('T')[0]
      whereClause += " AND date > '" + nowDateStr + "' AND date < '" + desiredDateStr + "'"
    }

    db.query('SELECT * FROM Event WHERE ' + whereClause).then((result) => {
      if (
        result?.length === 0) {
        res.status(404).send({message: 'Event not found'});
        return;
      }

      res.send(result);
    })
  })
  .get('/:id', (req: Request, res: Response) => {
    db.query("SELECT * FROM Event WHERE uid = ?", [req.params.id]).then((result) => {
      if (result.length === 0) {
        res.status(404).send({message: 'Event not found'});
        return;
      }
      res.send(result[0]);
    })
    res.send({message: 'Event works!'});
  })
  .post('/', requireAuthorization, (req: Request, res: Response) => {
    const id = generateId(idType.Event)

    const event: Partial<Event> = req.body;
    if (!event.dateTime || !event.title || !event.location || !event.description) return res.status(400).send({message: 'Missing required fields'});
    db.query('INSERT INTO Event (uid, title, description, location, date, userUid) VALUES (?, ?, ?, ?, ?, ?) ',
      [id, event.title, event.description, event.location, event.dateTime, event?.userUid ?? 0]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(500).send({message: 'Error creating event'});
        return;
      }
      res.status(201).send({message: 'Event created'});
    }).catch((err) => {
      res.status(500).send({message: 'Error creating event'});

    })
  })
  .put('/:id', requireAuthorization, (req: Request, res: Response) => {
    const event: Partial<Event> = req.body;
    if (!event.dateTime || !event.title || !event.location || !event.description) return res.status(400).send({message: 'Missing required fields'});
    db.query('UPDATE Event SET title = ?, description = ?, location = ?, date = ?, userUid = ? WHERE uid = ?',
      [event.title, event.description, event.location, event.dateTime, event?.userUid ?? 0, req.params.id]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send({message: 'Event not found'});
        return;
      }
      res.send({message: 'Event updated'});
    }).catch((err) => {
      res.status(500).send({message: 'Error updating event'});
    })
  })
  .delete('/:id', requireAuthorization, (req: Request, res: Response) => {
    db.query('DELETE FROM Event WHERE uid = ?', [req.params.id]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(404).send({message: 'Event not found'});
        return;
      }
      res.send({message: 'Event deleted'});
    }).catch((err) => {
      res.status(500).send({message: 'Error deleting event'});
    })
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
