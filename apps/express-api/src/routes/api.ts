import express, {NextFunction, Request, Response, Router} from "express";
import Database from "../db";
import * as crypto from "node:crypto";
import {Article, Event, User} from "@hsb-dbweb/shared"
import {SqlQueryBuilder} from "./SqlQueryBuilder";

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
    const qb = new SqlQueryBuilder()
    .select(['uid', 'username', 'email','name', 'role', 'activated'])
    .from('User')

    db.query(qb.build()).then((result) => {
      res.send(result);
    }).catch((err) => {
      res.status(500).send({message: 'Error fetching users'});
    })
  })
  .get('/:id', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
    .select(['uid', 'username', 'email','name', 'role', 'activated'])
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
  .post('/', (req: Request, res: Response) => {
    const id = generateId(idType.User)
    const user: Partial<User> = req.body;
    const qb = new SqlQueryBuilder()
    .insertInto('User', ["uid", "username", "password", "email", "role", "activated"])
    .values(6)
    db.query(qb.build(),
      [id, user.username, user.password, user.email, user.role, user.activated]).then((result) => {
      if (result.affectedRows === 0) {
        res.status(500).send({message: 'Error creating user'});
        return;
      }
      res.status(201).send({message: 'User created'});
    }).catch((err) => {
      res.status(500).send({message: 'Error creating user'});
    })
  })
  .put('/:id', (req: Request, res: Response) => {
    const user: Partial<User> = req.body;
    const params = []
    const qb = new SqlQueryBuilder()
    .update("User")
    if (user.username){
      qb.set("username")
      params.push(user.username)
    }
    if (user.password){
      // TODO HASH PASSWORD HERE
      qb.set("password")
      params.push(user.password)
    }
    if (user.email){
      qb.set("email")
      params.push(user.email)
    }
    if (user.role){
      qb.set("role")
      params.push(user.role)
    }
    if (user.activated){
      qb.set("activated")
      params.push(user.activated)
    }
    qb.where("uid")
    params.push(req.params.username)
    db.query(qb.build(), params).then((result) => {
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
    if (article.title){
      qb.set("title")
      params.push(article.title)
    }
    if (article.content){
      qb.set("content")
      params.push(article.content)
    }
    if (article.subtitle){
      qb.set("subtitle")
      params.push(article.subtitle)
    }
    if (article.author){
      qb.set("author")
      params.push(article.author)
    }
    if (article.media){
      qb.set("media")
      params.push(article.media)
    }
    if (article.userUid){
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
