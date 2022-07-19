import { WsException } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import { Catch, ArgumentsHost, HttpException, ExceptionFilter } from '@nestjs/common';
import { IoTError } from '../../models/iot/IoTproject/IoTLayoutManager';
import { IOT_EVENT } from './userSocket.types';

@Catch(WsException, HttpException, IoTError)
export class IoTExceptionFilter implements ExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    if (host.getType() == 'ws') {
      const wsHost = host.switchToWs();
      const client: WebSocket = wsHost.getClient();
      client.send(JSON.stringify({ event: IOT_EVENT.ERROR, data: exception.message }));
    } else if (host.getType() == 'http') {
      //const httpHost = host.switchToHttp();
    }
  }
}