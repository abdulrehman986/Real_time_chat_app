import { Server, Socket } from 'socket.io';
import http from 'http';
import { Message } from '../../models';
import { Op } from 'sequelize';
import { getAppCorsUrl } from '../utils/helpers';

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'https://rtcapp.serveo.net',
        'http://localhost:5173',
      ],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinChat', async ({ senderId, recipientId }) => {
      try {
        const messages = await Message.findAll({
          where: {
            [Op.or]: [
              { senderId, recipientId },
              { senderId: recipientId, recipientId: senderId },
            ],
          },
          order: [['createdAt', 'ASC']],
        });
        socket.emit('previousMessages', messages);
      } catch (error) {
        console.error('Error fetching previous messages:', error);
      }
    });

    socket.on('sendMessage', async (message) => {
      try {
        const { id, ...messageWithoutId } = message;
        const savedMessage = await Message.create(messageWithoutId);
        io.emit('receiveMessage', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};
