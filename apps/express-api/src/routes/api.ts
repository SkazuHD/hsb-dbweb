import express, {NextFunction, Request, Response, Router} from "express";
import Database from "../db";

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

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  //Auth middleware | Checks if user is authenticated and provides valid token
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
  .get('/:username', (req: Request, res: Response) => {
    res.send({message: 'Profile works!'});
  })
  .post('/:username', (req: Request, res: Response) => {
    res.send({message: 'Profile works!'});
  })
  .put('/:username', (req: Request, res: Response) => {
    res.send({message: 'Profile works!'});
  })
  .delete('/:username', (req: Request, res: Response) => {
    res.send({message: 'Profile works!'});
  });
//Article routes
articleRouter
  .get('/', (req: Request, res: Response) => {
    res.send({message: 'Article works!'})
  })
  .get('/:id', (req: Request, res: Response) => {
    console.log(res.getHeaders())
    db.query('SELECT * FROM article WHERE id = ?', [req.params.id]).then((result) => {
      if (result.length === 0) {
        res.status(404).send({message: 'Article not found'});
        return;
      }
      
      res.send(result[0]);
    })
  })
  .post('/', (req: Request, res: Response) => {
    res.send({message: 'Article works!'});
  })
  .put('/:id', (req: Request, res: Response) => {
    res.send({message: 'Article works!'});
  })
  .delete('/:id', (req: Request, res: Response) => {
    res.send({message: 'Article works!'});
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
