import { Controller, Get, Logger, Req, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Auth } from '../../utils/decorators/auth.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { IOT_EVENT, Client, UserSocketTicketPayload } from './userSocket.types';
import { UserEntity } from '../../models/user/entities/user.entity';
import { UserService } from '../../models/user/user.service';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

const gatewayPort = Number(process.env.USER_SOCKET_GATEWAY_PORT);
if (gatewayPort == NaN || !gatewayPort) {
  throw new Error(
    'USER_SOCKET_GATEWAY_PORT was not set in .env. Copy the IOT_SOCKET_GATEWAY_PORT variable from .env.example inside your .env file.',
  );
}

const cors = process.env.CORS_ORIGIN;
if (!cors) {
  throw new Error(
    'CORS_ORIGIN was not set in .env. Copy the CORS_ORIGIN variable from .env.example inside your .env file.',
  );
}

@UseInterceptors(DTOInterceptor)
@WebSocketGateway(gatewayPort, { cors })
@Controller('userSocket')
export class UserSocketGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private logger: Logger;

  constructor(private userService: UserService) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    if (!this.logger) this.logger = new Logger('UserSocketGateway');
    this.logger.log(`Initialized`);

    // Set the ping interval to ping each connected object (each 15 seconds)
    setInterval(() => {
      Client.getClients().forEach(client => {
        // Client still hasn't responded to the ping, it is presumed dead
        if (!client.isAlive) {
          client.removeClient();
          return client.getSocket().terminate();
        }

        // Client is ping to see if it is still alive
        client.isAlive = false;
        client.getSocket().ping();
        client.sendEvent(IOT_EVENT.PING, null);
      });
    }, 60 * 1000); // Each 60 seconds
  }

  async handleConnection(socket: WebSocket, data) {
    console.log((socket as any)._socket);
    const lst = data.url.split('?');
    const clienta = new Client(socket);
    clienta.register();
    if (lst.length < 2) return socket.close();

    // Grab ticket from the url
    const params = new URLSearchParams(lst[1]);
    const ticketRecv = params.get('ticket');
    if (!ticketRecv) return socket.close();

    // Verify the ticket (JWT)
    let payload: UserSocketTicketPayload;
    try {
      const payloadUntyped = verify(ticketRecv, process.env.USER_SOCKET_TICKEY_SECRET_KEY) as any;
      if (!payloadUntyped || !payloadUntyped.id || !payloadUntyped.email || !payloadUntyped.ip) return socket.close();
      payload = payloadUntyped as UserSocketTicketPayload;
    } catch {
      socket.close();
    }

    // Finds the user related to the ticket, and at the same time checks if the user does exist
    let user: UserEntity;
    try {
      user = await this.userService.findByIdAndEmail(payload.id, payload.email);
    } catch {
      return socket.close();
    }

    // Compare the saved ticket with the given ticket
    const payloadSaved = verify(user.ticket, process.env.USER_SOCKET_TICKEY_SECRET_KEY) as UserSocketTicketPayload;
    if (payloadSaved.ip !== payload.id) return socket.close();

    // Disabling the ticket
    await this.userService.disableTicket(user);

    // Success, register the client
    const client = new Client(socket);
    client.register();
    this.logger.log(`Client connected`);
  }

  receivePong(socket: WebSocket) {
    const client = Client.getClientBySocket(socket);
    if (client) client.isAlive = true;
  }

  async handleDisconnect(@ConnectedSocket() socket: WebSocket) {
    this.logger.log(`Client disconnected`);
    Client.removeClientBySocket(socket);
  }

  @SubscribeMessage(IOT_EVENT.PONG)
  pong(@ConnectedSocket() socket: WebSocket) {
    this.receivePong(socket);
  }

  @Get('ticket')
  @Auth()
  async getTicket(@User() user: UserEntity, @Req() req: Request) {
    return await this.userService.generateWebsocketTicket(user, req.ip);
  }
}
