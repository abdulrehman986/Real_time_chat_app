import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import config from '../../config';
import express from 'express';
import { sequelize } from '../db/db';

export function SessionInit(app: express.Application) {
  app.set('trust proxy', 1); // trust first proxy
  // Session Store
  const SequelizeStore = connectSessionSequelize(session.Store);
  const sessionMiddleware = session({
    secret: config.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
    name: 'live chat',
    proxy: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: config.NODE_ENV === 'production' ? true : false, // cookie will only be sent over HTTPS
      // secure: true,
      // sameSite: 'none',
    },
  });
  app.use(sessionMiddleware);

  return sessionMiddleware;
}
