import express, {NextFunction, Request, Response, Router} from "express";
import Database from "../db";
import * as crypto from "node:crypto";
import {Article, Event, User} from "@hsb-dbweb/shared"
import {SqlQueryBuilder} from "./SqlQueryBuilder";
import bcrypt from 'bcrypt';
import {jwtVerify, SignJWT} from 'jose';
import {rateLimit} from "express-rate-limit";


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
    return "U-" + crypto.randomInt(10000) + Date.now()

}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})

const requestContainsToken = (req: Request) => {
  return req.header("Authorization") !== undefined;
}

const requireAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  //Auth middleware | Checks if user is authenticated and provides valid token
  console.debug(req.header("Authorization"))

  const authHeader = req.header("Authorization");

  if (!requestContainsToken(req)) {
    res.status(401).send({message: "Unauthorized"})
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).send({message: "Unauthorized"});
    return;
  }

  try {
    const secret = new TextEncoder().encode('your-secret-key'); // Use the same secret key
    const {payload} = await jwtVerify(token, secret);
    req.body.user = payload;
    next();
  } catch (err) {
    res.status(401).send({message: "Invalid token"});
  }

  //TODO check if token is valid
  next();
}

const requireAuthorization = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role !== requiredRole) {
      res.status(403).send({message: "Forbidden"});
      return;
    }
    // TODO Decode JWT and check if user has the required role
    next();
  };
};

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.debug(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}


router
  .use(limiter)
  .use(express.json())
  .use(requestLogger)
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
  .post('/login', async (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
    qb.select('*').from('User').where('email')
    try {
      const result = await db.query(qb.build(), [req.body.email]);
      if (result.length === 0) {
        res.status(401).send({message: 'Invalid username or password'});
        return;
      }

      const hashedPassword = result[0].password;
      const match = bcrypt.compare(req.body.password, hashedPassword);
      if (!match) {
        res.status(401).send({message: 'Invalid username or password'});
        return;
      }
      const user: Omit<User, 'password'> = {...result[0], password: null}
      const secret = new TextEncoder().encode('your-secret-key'); // Use a strong secret key
      const token = await new SignJWT({user})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);

      res.setHeader('Authorization', `Bearer ${token}`)
      res.status(200).send({message: 'Login successful', token, user});
    } catch (err) {
      res.status(500).send({message: 'Error logging in'});
    }
  })


  .post('/register', async (req: Request, res: Response) => {
    if (!req.body.password || !req.body.username || !req.body.email) {
      return res.status(400).json({error: 'missing Parameters'});
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const id = generateId(idType.User)
    const qb = new SqlQueryBuilder()
    qb.insertInto('User', ['uid', 'username', 'password', 'email', 'role', 'activated']).values(6)
    // Todo add role table as FK constraint^
    console.log(req.body)
    db.query(qb.build(),
      [id, req.body.username, hashedPassword, req.body.email, "user", true]).then(async (result) => {
      if (result.affectedRows === 0) {
        res.status(500).send({message: 'Error creating user'});
        return;
      }
      const secret = new TextEncoder().encode('your-secret-key'); // Use a strong secret key

      const user: Omit<User, 'password'> = {
        uid: id,
        username: req.body.username,
        email: req.body.email,
        role: "user",
        activated: true
      }

      const token = await new SignJWT({user})
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);

      res.setHeader('Authorization', `Bearer ${token}`)
      res.status(201).send({message: 'User created', token, user});
    }).catch((err) => {
      res.status(500).send({message: 'Error creating user'});
    })
  })


  .get("/test", (req: Request, res: Response) => {
    res.send({message: "Auth Router works"})
  })
//Profile routes
profileRouter.use(requireAuthentication)
profileRouter
  .get('/', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .select(['uid', 'username', 'email', 'name', 'role', 'activated'])
      .from('User')

    db.query(qb.build()).then((result) => {
      res.send(result);
    }).catch((err) => {
      res.status(500).send({message: 'Error fetching users'});
    })
  })
  .get('/:id', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .select(['uid', 'username', 'email', 'name', 'role', 'activated'])
      .from('User')
      .where('uid')

    db.query(qb.build(), [req.params.id]).then((result) => {
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
  .delete('/:id', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .deleteFrom("User")
      .where("uid")

    db.query(qb.build(), [req.params.username]).then((result) => {
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
  .get('/:articleId/likes', (req: Request, res: Response) => {

    const qb = new SqlQueryBuilder()
    qb.select(['*']).from('User_article')
      .where('articleUid')
      .and('liked')

    //TODO REPLACE 0 (UserID) WITH USER ID FROM TOKEN
    db.query(qb.build(), [req.params.articleId, 1, "0"]).then((result) => {
      const likes = result.length;
      const liked = result.find((like) => like.userUid === "0") !== undefined;
      res.send({likes, liked});

    }).catch((err) => {
      console.log(err)
      res.status(500).send({message: 'Error fetching likes'});
    })
  })
  .post('/:articleId/likes', requireAuthentication, (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .insertInto('User_article', ['articleUid', 'userUid', 'liked'])
      .values(3)
      .onDuplicateKey(['liked'], ['NOT liked'])

    //TODO REPLACE 0 (UserID) WITH USER ID FROM TOKEN
    db.query(qb.build(), [req.params.articleId, "0", 1]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(500).send({message: 'Error updating article likes'});
        return;
      }
      res.send({message: 'Article likes updated'});
    }).catch((err) => {
      res.status(500).send({message: 'Error updating article likes'});
    })
  })
  .delete('/:articleId/likes', requireAuthorization, (req: Request, res: Response) => {
  })


  .get('/', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .select('*')
      .from('Article')

    db.query(qb.build()).then((result) => {
      res.send(result);
    }).catch((err) => {
      res.status(500).send({message: 'Error fetching articles'});
    })
  })
  .get('/:id', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .select('*')
      .from('Article')
      .where('uid')

    db.query(qb.build(), [req.params.id]).then((result) => {
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
    const article: Partial<Article> = req.body;
    const qb = new SqlQueryBuilder()
      .insertInto('Article', ["uid", "title", "content", "subtitle", "author", "media", "userUid"])
      .values(7)

    db.query(qb.build(),
      [id, article.title, article.content, article.subtitle, article.author, article.media, article.userUid]).then((result) => {
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
    const params = []
    const article: Partial<Article> = req.body;
    const qb = new SqlQueryBuilder()
      .update("Article")
    if (article.title) {
      qb.set("title")
      params.push(article.title)
    }
    if (article.content) {
      qb.set("content")
      params.push(article.content)
    }
    if (article.subtitle) {
      qb.set("subtitle")
      params.push(article.subtitle)
    }
    if (article.author) {
      qb.set("author")
      params.push(article.author)
    }
    if (article.media) {
      qb.set("media")
      params.push(article.media)
    }
    if (article.userUid) {
      qb.set("userUid")
      params.push(article.userUid)
    }
    qb.where("uid")
    params.push(req.params.id)
    db.query(qb.build(), params).then((result) => {
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
    const qb = new SqlQueryBuilder()
      .deleteFrom("Article")
      .where("uid")

    db.query(qb.build(), [req.params.id]).then((result) => {
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
    let qb = new SqlQueryBuilder().select('*').from('Event').where('1', 1)
    if (req.query.type) qb = qb.and('type', req.query.type.toString(),)
    if (req.query.date) qb = qb.and('date', req.query.date.toString())
    if (req.query.location) qb = qb.and('location', req.query.location.toString(),)

    if (req.query.upcoming) {
      const range = parseInt(req.query.upcoming[0]);
      const nowDate = new Date()
      const desiredDate = new Date(nowDate)
      desiredDate.setDate(nowDate.getDate() + range)
      const nowDateStr = nowDate.toISOString().split('T')[0]
      const desiredDateStr = desiredDate.toISOString().split('T')[0]
      qb = qb.and('date', nowDateStr, ">").and('date', desiredDateStr, "<")
    }
    db.query(qb.build()).then((result) => {
      if (
        result?.length === 0) {
        res.status(404).send({message: 'Event not found'});
        return;
      }

      res.send(result);
    })
  })
  .get('/:id', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .select('*')
      .from('Event')
      .where('uid')

    db.query(qb.build(), [req.params.id]).then((result) => {
      if (result.length === 0) {
        res.status(404).send({message: 'Event not found'});
        return;
      }
      res.send(result[0]);
    })
    res.send({message: 'Event works!'});
  })
  .post('/', requireAuthorization, (req: Request, res: Response) => {

    const event: Partial<Event> = req.body;

    if (!event.dateTime || !event.title || !event.location || !event.description) return res.status(400).send({message: 'Missing required fields'});

    const id = generateId(idType.Event)
    const qb = new SqlQueryBuilder()
      .insertInto('Event', ["uid", "title", "description", "location", "date", "userUid"])
      .values(6)

    db.query(qb.build(),
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
    const params = []
    const qb = new SqlQueryBuilder()
      .update("Event")
    if (event.dateTime) {
      qb.set("date")
      params.push(event.dateTime)
    }
    if (event.location) {
      qb.set("location")
      params.push(event.location)
    }
    if (event.type) {
      qb.set("type")
      params.push(event.type)
    }
    if (event.title) {
      qb.set("title")
      params.push(event.title)
    }
    if (event.description) {
      qb.set("description")
      params.push(event.description)
    }
    if (event.userUid) {
      qb.set("userUid")
      params.push(event.userUid)
    }
    qb.where("uid")
    params.push(req.params.id)

    db.query(qb.build(), params).then((result) => {
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
    const qb = new SqlQueryBuilder()
      .deleteFrom("Event")
      .where("uid")

    db.query(qb.build(), [req.params.id]).then((result) => {
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
