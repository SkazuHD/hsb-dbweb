import express, { NextFunction, Request, Response, Router } from 'express';
import Database from '../db';
import * as crypto from 'node:crypto';
import {
  AccessTokenPayload,
  Article,
  Event,
  JWTScope,
  RefreshTokenPayload,
  User,
  UserRole,
  UserScope,
} from '@hsb-dbweb/shared';
import { SqlQueryBuilder } from './SqlQueryBuilder';
import bcrypt from 'bcrypt';
import { jwtVerify } from 'jose';
import { rateLimit } from 'express-rate-limit';
import { JwtManager } from '../jwt';
import { createConnection } from 'mariadb';
import multer from 'multer';

const upload = multer();

const router: Router = express.Router();
const authRouter = express.Router();
const profileRouter = express.Router();
const articleRouter = express.Router();
const galleryRouter = express.Router();
const eventRouter = express.Router();
const db = Database.getInstance();
const jwt = new JwtManager('replace-me-with-a-real-secret');

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
  Comment,
}

function generateId(type: idType) {
  if (type === idType.Article)
    return 'A-' + crypto.randomInt(10000) + Date.now();
  else if (type === idType.Event)
    return 'E-' + crypto.randomInt(10000) + Date.now();
  else if (type === idType.User)
    return 'U-' + crypto.randomInt(10000) + Date.now();
  else if (type === idType.Comment)
    return 'C-' + crypto.randomInt(10000) + Date.now();
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

const requestContainsToken = (req: Request) => {
  return req.header('Authorization') !== undefined;
};

const requireAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //Auth middleware | Checks if user is authenticated and provides valid token

  const authHeader = req.header('Authorization');
  if (authHeader === undefined) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  try {
    const { payload } = await jwt.verifyToken<AccessTokenPayload>(token);
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ message: 'Invalid token' });
  }
};

const requireAuthorization = (requiredRole: UserRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!requestContainsToken(req)) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }
    const authHeader = req.header('Authorization');

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }
    try {
      const { payload } = await jwt.verifyToken<AccessTokenPayload>(token);

      if (payload.role !== requiredRole) {
        res.status(403).send({ message: 'Forbidden' });
        return;
      }
      next();
    } catch (err) {
      res.status(401).send({ message: 'Invalid token' });
    }
  };
};

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.debug(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
  );
  next();
};

router
  .use(limiter)
  .use(express.json())
  .use(requestLogger)
  .use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.ip);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // replace with your Angular app's URL
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    next();
  })
  .use('/auth/', authRouter)
  .use('/profile/', profileRouter)
  .use('/article/', articleRouter)
  .use('/gallery/', galleryRouter)
  .use('/events/', eventRouter)
  .use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res
      .status(500)
      .send({ message: err.message ? err.message : 'Something broke!' });
  });

galleryRouter
  .get('/', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder().select('*').from('Gallery');
    db.query(qb.build())
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error fetching gallery items' });
      });
  })

  .post(
    '/',
    requireAuthorization(UserRole.ADMIN),
    async (req: Request, res: Response) => {
      if (!req.body.url || !req.body.alt) {
        return res.status(400).json({ error: 'missing Parameters' });
      }
      const qb = new SqlQueryBuilder()
        .insertInto('Gallery', ['Url', 'Alt'])
        .values(2);
      db.query(qb.build(), [req.body.url, req.body.alt])
        .then((result) => {
          if (result.affectedRows === 0) {
            res.status(500).send({ message: 'Error creating gallery item' });
            return;
          }
          res.status(201).send({ message: 'Gallery item created' });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error creating gallery item' });
        });
    },
  )
  .delete(
    '/',
    requireAuthorization(UserRole.ADMIN),
    (req: Request, res: Response) => {
      const qb = new SqlQueryBuilder().deleteFrom('Gallery').where('url');
      db.query(qb.build(), [req.body.url])
        .then((result) => {
          if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Gallery item not found' });
            return;
          }
          res.send({ message: 'Gallery item deleted' });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error deleting gallery item' });
        });
    },
  );

//Auth routes
authRouter
  .post('/login', async (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder();
    qb.select('*').from('User').where('email');
    try {
      const result = await db.query(qb.build(), [req.body.email]);
      if (result.length === 0) {
        res.status(401).send({ message: 'Invalid username or password' });
        return;
      }

      const hashedPassword = result[0].password;
      const match = bcrypt.compare(req.body.password, hashedPassword);
      if (!match) {
        res.status(401).send({ message: 'Invalid username or password' });
        return;
      }
      const user: Omit<User, 'password'> = { ...result[0], password: null };
      const token = await jwt.createAccessToken({
        uid: user.uid,
        role: user.role,
        scope: [UserScope.READ, UserScope.WRITE],
        type: JWTScope.ACCESS,
      });
      const refreshToken = await jwt.createRefreshToken({
        uid: user.uid,
        type: JWTScope.REFRESH,
      });

      const idToken = await jwt.createIdToken({
        uid: user.uid,
        role: user.role,
        type: JWTScope.ID,
        email: user.email,
        username: user.username,
      });

      res.setHeader('Authorization', `Bearer ${token}`);
      res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly; SameSite=None;');
      res.status(200).send({
        message: 'Login successful',
        accessToken: token,
        idToken,
        refreshToken,
        user,
      });
    } catch (err) {
      res.status(500).send({ message: 'Error logging in' });
    }
  })

  .post('/register', async (req: Request, res: Response) => {
    if (!req.body.password || !req.body.username || !req.body.email) {
      return res.status(400).json({ error: 'missing Parameters' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const id = generateId(idType.User);
    const qb = new SqlQueryBuilder();
    qb.insertInto('User', [
      'uid',
      'username',
      'password',
      'email',
      'role',
      'activated',
      'picture',
    ]).values(6);
    // Todo add role table as FK constraint^
    db.query(qb.build(), [
      id,
      req.body.username,
      hashedPassword,
      req.body.email,
      'user',
      true,
    ])
      .then(async (result) => {
        if (result.affectedRows === 0) {
          res.status(500).send({ message: 'Error creating user' });
          return;
        }
        const user: Omit<User, 'password'> = {
          uid: id,
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          role: UserRole.USER,
          activated: true,
          picture: null,
        };

        // TODO CREATE HELPER FUNCTION FOR TOKEN CREATION

        const token = await jwt.createAccessToken({
          uid: user.uid,
          role: user.role,
          scope: [UserScope.READ, UserScope.WRITE],
          type: JWTScope.ACCESS,
        });
        const refreshToken = await jwt.createRefreshToken({
          uid: user.uid,
          type: JWTScope.REFRESH,
        });

        const idToken = await jwt.createIdToken({
          uid: user.uid,
          role: user.role,
          type: JWTScope.ID,
          email: user.email,
          username: user.username,
        });

        res.setHeader('Authorization', `Bearer ${token}`);
        res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly; SameSite=None;');
        res.status(201).send({
          message: 'User created',
          accessToken: token,
          idToken,
          refreshToken,
          user,
        });
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error creating user' });
      });
  })
  .post('/refresh', async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      res.status(400).send({ message: 'Missing parameters' });
      return;
    }
    const { payload } =
      await jwt.verifyToken<RefreshTokenPayload>(refreshToken);
    if (payload.type !== JWTScope.REFRESH) {
      res.status(400).send({ message: 'Invalid token' });
      return;
    }
    const qb = new SqlQueryBuilder();
    qb.select('*').from('User').where('uid');
    try {
      const result = await db.query(qb.build(), [payload.uid]);
      if (result.length === 0) {
        res.status(401).send({ message: 'Invalid username or password' });
        return;
      }
      const user: Omit<User, 'password'> = { ...result[0], password: null };
      const token = await jwt.createAccessToken({
        uid: user.uid,
        role: user.role,
        scope: [UserScope.READ, UserScope.WRITE],
        type: JWTScope.ACCESS,
      });
      const idToken = await jwt.createIdToken({
        uid: user.uid,
        role: user.role,
        type: JWTScope.ID,
        email: user.email,
        username: user.username,
      });
      const newRefreshToken = await jwt.createRefreshToken({
        uid: user.uid,
        type: JWTScope.REFRESH,
      });

      res.setHeader('Authorization', `Bearer ${token}`);
      res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly; SameSite=None;');
      res.status(200).send({
        message: 'Refresh successful',
        accessToken: token,
        idToken,
        refreshToken: newRefreshToken,
        user,
      });
    } catch (err) {
      res.status(500).send({ message: 'Error refreshing Token' });
    }
  })

  .get('/test', (req: Request, res: Response) => {
    res.send({ message: 'Auth Router works' });
  });
//Profile routes

profileRouter
  .get('/', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .select([
        'uid',
        'username',
        'email',
        'name',
        'role',
        'activated',
        'picture',
      ])
      .from('User');

    db.query(qb.build())
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error fetching users' });
      });
  })
  .get('/:id', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .select([
        'uid',
        'username',
        'email',
        'name',
        'role',
        'activated',
        'picture',
      ])
      .from('User')
      .where('uid');

    db.query(qb.build(), [req.params.id])
      .then((result) => {
        if (result.length === 0) {
          res.status(404).send({ message: 'User not found' });
          return;
        }
        return res.send(result[0]);
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error fetching user' });
      });
  });
profileRouter
  .put(
    '/:uid',
    upload.single('picture'),
    requireAuthentication,
    async (req: Request, res: Response) => {
      const user: Partial<User> = JSON.parse(req.body.user);
      const picture = req.file; // This is the uploaded file
      await jwt
        .getUserIdFromToken(req.header('Authorization').split(' ')[1])
        .then((userId) => {
          if (req.params.uid !== userId) {
            return res.status(403).send({ message: 'Forbidden' });
          }
          const params = [];

          const qb = new SqlQueryBuilder().update('User');
          if (user.username) {
            qb.set('username');
            params.push(user.username);
          }
          if (user.password) {
            qb.set('password');
            params.push(user.password);
          }
          if (user.name) {
            qb.set('name');
            params.push(user.name);
          }
          if (user.email) {
            qb.set('email');
            params.push(user.email);
          }
          if (user.role) {
            qb.set('role');
            params.push(user.role);
          }
          if (user.activated) {
            qb.set('activated');
            params.push(user.activated);
          }
          if (picture) {
            qb.set('picture');
            params.push(picture.buffer);
          }
          if (params.length === 0) {
            res.status(400).send({ message: 'No fields to update' });
            return;
          }

          qb.where('uid');
          params.push(req.params.uid);

          db.query(qb.build(), params)
            .then((result) => {
              if (result.affectedRows === 0) {
                res.status(404).send({ message: 'User not found' });
                return;
              }
              res.send({ message: 'User updated' });
            })
            .catch((err) => {
              res.status(500).send({ message: 'Error updating user' });
            });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error updating user' });
        });
    },
  )

  .put('/:username', requireAuthentication, (req: Request, res: Response) => {
    db.query(
      'UPDATE User SET username = ?, password = ?, email = ?, role = ?, activated = ? WHERE uid = ?',
      [
        req.body.username,
        req.body.password,
        req.body.email,
        req.body.role,
        req.body.activated,
        req.params.username,
      ],
    )
      .then((result) => {
        if (result.affectedRows === 0) {
          res.status(404).send({ message: 'User not found' });
          return;
        }
        res.send({ message: 'User updated' });
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error updating user' });
      });
  })
  .delete('/:id', requireAuthentication, (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder().deleteFrom('User').where('uid');

    db.query(qb.build(), [req.params.username])
      .then((result) => {
        if (result.affectedRows === 0) {
          res.status(404).send({ message: 'User not found' });
          return;
        }
        res.send({ message: 'User deleted' });
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error deleting user' });
      });
  });
//Article routes
articleRouter
  .get('/:articleId/likes', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder();
    qb.select(['*']).from('User_article').where('articleUid').and('liked');

    //TODO REPLACE 0 (UserID) WITH USER ID FROM TOKEN
    if (requestContainsToken(req)) {
      jwt
        .getUserIdFromToken(req.header('Authorization').split(' ')[1])
        .then((userId) => {
          db.query(qb.build(), [req.params.articleId, userId, 1])
            .then((result) => {
              const likes = result.length;
              const liked =
                result.find((like) => like.userUid === userId) !== undefined;
              res.send({ likes, liked });
            })
            .catch((err) => {
              res.status(500).send({ message: 'Error fetching likes' });
            });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error fetching likes' });
        });
    } else {
      db.query(qb.build(), [req.params.articleId, '0', 1])
        .then((result) => {
          const likes = result.length;
          const liked = false;
          res.send({ likes, liked });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error fetching likes' });
        });
    }
  })
  .post(
    '/:articleId/likes',
    requireAuthentication,
    (req: Request, res: Response) => {
      const qb = new SqlQueryBuilder()
        .insertInto('User_article', ['articleUid', 'userUid', 'liked'])
        .values(3)
        .onDuplicateKey(['liked'], ['NOT liked']);

      jwt
        .getUserIdFromToken(req.header('Authorization').split(' ')[1])
        .then((userId) => {
          db.query(qb.build(), [req.params.articleId, userId, 1])
            .then((result) => {
              if (result.affectedRows === 0) {
                res
                  .status(500)
                  .send({ message: 'Error updating article likes' });
                return;
              }
              res.send({ message: 'Article likes updated' });
            })
            .catch((err) => {
              res.status(500).send({ message: 'Error updating article likes' });
            });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error updating article likes' });
        });
    },
  )
  .get('/:articleId/comments', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder()
      .select(['Comment.*', 'User.username'])
      .from('Comment')
      .join('User', 'User.uid = Comment.userUid')
      .where('articleUid')
      .orderBy('timestamp', 'DESC');

    db.query(qb.build(), [req.params.articleId])
      .then((result) => {
        if (result.length === 0) {
          return res.send([]);
        }
        res.send(result);
      })
      .catch((err) => {
        return res.status(500).send({ message: 'Error fetching comments' });
      });
  })
  .post(
    '/:articleId/comments',
    requireAuthentication,
    (req: Request, res: Response) => {
      const qb = new SqlQueryBuilder()
        .insertInto('Comment', ['uid', 'articleUid', 'userUid', 'content'])
        .values(4);
      const id = generateId(idType.Comment);
      db.query(qb.build(), [
        id,
        req.params.articleId,
        req.body.comment.userUid,
        req.body.comment.content,
      ])
        .then((result) => {
          return res.status(201).send({ message: 'Comment created' });
        })
        .catch((err) => {
          return res.status(500).send({ message: 'Error creating comment' });
        });
    },
  )
  .delete(
    '/:articleId/comments/:commentId',
    requireAuthentication,
    (req: Request, res: Response) => {
      const qb = new SqlQueryBuilder().deleteFrom('Comment').where('uid');

      db.query(qb.build(), [req.params.commentId])
        .then((result) => {
          return res.send({ message: 'Comment deleted' });
        })
        .catch((err) => {
          return res.status(500).send({ message: 'Error deleting comment' });
        });
    },
  )
  .get('/', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder().select('*').from('Article');

    db.query(qb.build())
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error fetching articles' });
      });
  })
  .get('/:id', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder().select('*').from('Article').where('uid');

    db.query(qb.build(), [req.params.id])
      .then((result) => {
        if (result.length === 0) {
          res.status(404).send({ message: 'Article not found' });
          return;
        }
        res.send(result[0]);
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error fetching article' });
      });
  })
  .post('/', upload.single('media'), (req: Request, res: Response) => {
    const id = generateId(idType.Article);
    const article: Partial<Article> = JSON.parse(req.body.article);
    const image = req.file;

    const qb = new SqlQueryBuilder()
      .insertInto('Article', [
        'uid',
        'title',
        'content',
        'subtitle',
        'author',
        'media',
        'userUid',
      ])
      .values(7);

    db.query(qb.build(), [
      id,
      article.title,
      article.content,
      article.subtitle,
      article.author,
      /*article.media,*/
      image ? image.buffer : null,
      article.userUid,
    ])
      .then((result) => {
        if (result.affectedRows === 0) {
          res.status(500).send({ message: 'Error creating article' });
          return;
        }
        res.status(201).send({ message: 'Article created' });
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error creating article' });
      });
  })
  .put('/:id', upload.single('media'), (req: Request, res: Response) => {
    const params = [];
    const article: Partial<Article> = JSON.parse(req.body.article);
    const image = req.file; //uploaded image

    const qb = new SqlQueryBuilder().update('Article');
    if (article.title) {
      qb.set('title');
      params.push(article.title);
    }
    if (article.content) {
      qb.set('content');
      params.push(article.content);
    }
    if (article.subtitle) {
      qb.set('subtitle');
      params.push(article.subtitle);
    }
    if (article.author) {
      qb.set('author');
      params.push(article.author);
    }
    if (image) {
      qb.set('media');
      params.push(image.buffer);
    }
    if (article.userUid) {
      qb.set('userUid');
      params.push(article.userUid);
    }
    qb.where('uid');
    params.push(req.params.id);
    db.query(qb.build(), params)
      .then((result) => {
        if (result.affectedRows === 0) {
          res.status(404).send({ message: 'Article not found' });
          return;
        }
        res.send({ message: 'Article updated' });
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error updating article' });
      });
  })
  .delete('/:id', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder().deleteFrom('Article').where('uid');
    const qb2 = new SqlQueryBuilder()
      .deleteFrom('User_article')
      .where('articleUid');

    db.query(qb2.build(), [req.params.id]).then((result) => {
      db.query(qb.build(), [req.params.id])
        .then((result) => {
          if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Article not found' });
            return;
          }
          res.send({ message: 'Article deleted' });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error deleting article' });
        });
    });
  });
//Event routes
eventRouter
  .get('/', (req: Request, res: Response) => {
    let qb = new SqlQueryBuilder().select('*').from('Event').where('1', 1);
    if (req.query.type) qb = qb.and('type', req.query.type.toString());
    if (req.query.date) qb = qb.and('date', req.query.date.toString());
    if (req.query.location)
      qb = qb.and('location', req.query.location.toString());

    if (req.query.upcoming) {
      const range = parseInt(req.query.upcoming[0]);
      const nowDate = new Date();
      const desiredDate = new Date(nowDate);
      desiredDate.setDate(nowDate.getDate() + range);
      const nowDateStr = nowDate.toISOString().split('T')[0];
      const desiredDateStr = desiredDate.toISOString().split('T')[0];
      qb = qb.and('date', nowDateStr, '>').and('date', desiredDateStr, '<');
    }
    db.query(qb.build()).then((result) => {
      if (result?.length === 0) {
        res.status(404).send({ message: 'Event not found' });
        return;
      }

      res.send(result);
    });
  })
  .get('/:id', (req: Request, res: Response) => {
    const qb = new SqlQueryBuilder().select('*').from('Event').where('uid');

    db.query(qb.build(), [req.params.id]).then((result) => {
      if (result.length === 0) {
        res.status(404).send({ message: 'Event not found' });
        return;
      }
      res.send(result[0]);
    });
    res.status(500).send({ message: 'Error fetching event' });
  })
  .post(
    '/',
    requireAuthorization(UserRole.ADMIN),
    (req: Request, res: Response) => {
      const event: Partial<Event> = req.body;

      if (!event.date || !event.title || !event.location || !event.description)
        return res.status(400).send({ message: 'Missing required fields' });
      const id = generateId(idType.Event);
      const qb = new SqlQueryBuilder()
        .insertInto('Event', [
          'uid',
          'title',
          'description',
          'location',
          'date',
          'userUid',
          'type',
        ])
        .values(7);

      db.query(qb.build(), [
        id,
        event.title,
        event.description,
        event.location,
        event.date,
        event?.userUid ?? 0,
        event.type,
      ])
        .then((result) => {
          if (result.affectedRows === 0) {
            res.status(500).send({ message: 'Error creating event' });
            return;
          }
          res.status(201).send({ message: 'Event created' });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error creating event' });
        });
    },
  )
  .put(
    '/:id',
    requireAuthorization(UserRole.ADMIN),
    (req: Request, res: Response) => {
      const event: Partial<Event> = req.body;
      const params = [];
      const qb = new SqlQueryBuilder().update('Event');
      if (event.date) {
        qb.set('date');
        params.push(event.date);
      }
      if (event.location) {
        qb.set('location');
        params.push(event.location);
      }
      if (event.type) {
        qb.set('type');
        params.push(event.type);
      }
      if (event.title) {
        qb.set('title');
        params.push(event.title);
      }
      if (event.description) {
        qb.set('description');
        params.push(event.description);
      }
      if (event.userUid) {
        qb.set('userUid');
        params.push(event.userUid);
      }
      qb.where('uid');
      params.push(req.params.id);

      db.query(qb.build(), params)
        .then((result) => {
          if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Event not found' });
            return;
          }
          res.send({ message: 'Event updated' });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error updating event' });
        });
    },
  )
  .delete(
    '/:id',
    requireAuthorization(UserRole.ADMIN),
    (req: Request, res: Response) => {
      const qb = new SqlQueryBuilder().deleteFrom('Event').where('uid');

      db.query(qb.build(), [req.params.id])
        .then((result) => {
          if (result.affectedRows === 0) {
            res.status(404).send({ message: 'Event not found' });
            return;
          }
          res.send({ message: 'Event deleted' });
        })
        .catch((err) => {
          res.status(500).send({ message: 'Error deleting event' });
        });
    },
  );
//General Api routes
router
  .get('/', (req: Request, res: Response) => {
    res.send({ message: 'Express API Works!' });
  })
  .get('/hello', (req: Request, res: Response) => {
    res.send({ message: 'Hello World!' });
  })
  .get('/*', (req: Request, res: Response) => {
    res.status(404).send({ message: 'Not Found' });
  });

export default router;
