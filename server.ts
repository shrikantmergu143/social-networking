import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  io.on('connection', (socket) => {
    console.log('User connected via Socket.io:', socket.id);

    socket.on('join_conversation', (conversationId: string) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    socket.on('send_message', (data: { conversationId: string; text: string; senderId: string; imageUrl?: string }) => {
      const messageObj = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        conversationId: data.conversationId,
        senderId: data.senderId,
        text: data.text,
        imageUrl: data.imageUrl,
        timestamp: 'Just now',
        status: 'delivered'
      };
      // Broadcast to room (including sender or excluding sender if desired, but here we emit to all in room)
      io.to(data.conversationId).emit('receive_message', messageObj);
    });

    socket.on('typing', (data: { conversationId: string; isTyping: boolean; senderId: string }) => {
      socket.to(data.conversationId).emit('typing', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura real-time server running on port ${PORT}`);
  });
}

startServer();
