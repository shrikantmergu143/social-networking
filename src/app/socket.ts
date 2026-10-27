import { io, Socket } from 'socket.io-client';
import { store } from './store';

class SocketService {
  private socket: Socket | null = null;
  private activeConversationId: string | null = null;

  public connect(): Socket {
    if (!this.socket) {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const socketUrl = apiUrl.replace(/\/api\/?$/, '') || window.location.origin;
      this.socket = io(socketUrl, {
        path: '/socket.io',
        auth: callback => callback({ token: store.getState().auth.authToken }),
      });

      this.socket.on('connect', () => {
        if (this.activeConversationId) {
          this.socket?.emit('join_conversation', this.activeConversationId);
        }
      });
    }
    return this.socket;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public disconnect() {
    this.activeConversationId = null;
    this.socket?.disconnect();
    this.socket = null;
  }

  public joinConversation(conversationId: string) {
    if (this.socket && this.activeConversationId !== conversationId) {
      if (this.activeConversationId) {
        this.socket.emit('leave_conversation', this.activeConversationId);
      }
      this.activeConversationId = conversationId;
      this.socket.emit('join_conversation', conversationId);
    }
  }

  public sendTyping(data: { conversationId: string; isTyping: boolean; senderId: string }) {
    if (this.socket?.connected) {
      this.socket.emit('typing', data);
    }
  }
}

export const socketService = new SocketService();
