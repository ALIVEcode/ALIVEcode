import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Messages from 'src/models/social/messages/entities/messages.entity';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Messages
    ]),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}