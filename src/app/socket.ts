import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  public connect(): Socket {
    if (!this.socket) {
      this.socket = io({
        path: '/socket.io',
      });

      this.socket.on('connect', () => {
        console.log('Connected to Aura real-time messaging server, socket id:', this.socket?.id);
      });
    }
    return this.socket;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('join_conversation', conversationId);
    }
  }

  public sendMessage(data: { conversationId: string; text: string; senderId: string; imageUrl?: string }) {
    if (this.socket) {
      this.socket.emit('send_message', data);
    }
  }

  public sendTyping(data: { conversationId: string; isTyping: boolean; senderId: string }) {
    if (this.socket) {
      this.socket.emit('typing', data);
    }
  }
}

export const socketService = new SocketService();
