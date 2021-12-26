import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketAdapter extends IoAdapter {
  constructor(private app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);

    // Car gateway
    if (port === 8888) {
      console.log(`PORT 8888 ADAPTING TO WEBSOCKET`);
      //server.adapter(new Adapter(this.app));
      console.log('awdawd');
    }

    return server;
  }
}