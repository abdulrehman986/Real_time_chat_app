import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { initializeSocket } from './services/websocket';
import config from './config';
import AppRoutes from './routes';
import { sequelize } from './services/db/db';
import cors from 'cors';
import { SessionInit } from './services/session';
import { getAppCorsUrl } from './utils/helpers';

const app = express();
const server = http.createServer(app);
const PORT = config.SERVER_PORT;

// Configure session middleware
SessionInit(app);

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        [
          'http://localhost:3000',
          'https://rtcapp.serveo.net',
          'http://localhost:5173',
        ].indexOf(origin) !== -1
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }),
);

// Parse JSON requests
app.use(express.json());

// Initialize routes
AppRoutes(app);

// Initialize Socket.IO
initializeSocket(server);

// Database synchronization and server start
sequelize
  .sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database synchronization failed:', error);
  });
