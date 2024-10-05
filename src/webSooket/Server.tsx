import * as WebSocket from 'ws';
import { EventEmitter } from 'events';
import { IncomingMessage } from 'http';
import { parse } from 'url';

class WebSocketServer extends EventEmitter {
  private wss: WebSocket.Server;
  private clients: Map<string, WebSocket>;

  constructor(port: number) {
    super();
    this.wss = new WebSocket.Server({ port });
    this.clients = new Map();

    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request);

      if (request.url) {
        const { pathname } = parse(request.url);

        
          ws.on('message', (message: string) => {
            this.receiveMessage(ws, message);
          });
      
       
      }

      ws.on('close', () => {
       /// this.clientDisconnect(ws);
      });

      ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error.message);
      });
    });
  }

  public sendMessageById(clientId: string, message: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.send(message);
    }
  }

  public sendMessage(message: string): void {
    this.wss.clients.forEach((item) => {
      if (item.readyState === WebSocket.OPEN) {
        item.send(message);
      } else {
        console.log('WebSocket connection is not open.');
      }
    });
  }

  public clientDisconnectById(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.terminate();
    }
  }

  private handleConnection(ws: WebSocket, request: IncomingMessage): void {
    const clientId = this.generateClientId();
    this.clients.set(clientId, ws);
 
  }

  private receiveMessage(ws: WebSocket, message: string): void {
    const clientId = this.getClientIdByWebSocket(ws);

    if (clientId) {
      this.emit('message', { clientId, message });
    }
  }

  private receivePrivateMessage(ws: WebSocket, message: string): void {
    const clientId = this.getClientIdByWebSocket(ws);

    if (clientId) {
      this.emit('private', { clientId, message });
    }
  }

  private clientDisconnect(ws: WebSocket): void {
    const clientId = this.getClientIdByWebSocket(ws);
    if (clientId) {
      this.clients.delete(clientId);
      console.log(`Client disconnected with ID: ${clientId}`);
    }
  }

  private getClientIdByWebSocket(ws: WebSocket): string | undefined {
    for (const [clientId, clientWs] of this.clients.entries()) {
      if (clientWs === ws) {
        return clientId;
      }
    }
    return undefined;
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(7);
  }
}

// Create an instance of the WebSocketServer class on port 9003
export const Socket = new WebSocketServer(9003);
