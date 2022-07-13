import { Module } from '@nestjs/common';
import { UserSocketGateway } from './userSocket.gateway';
import { UserService } from '../../models/user/user.service';
import { UserModule } from '../../models/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [UserSocketGateway],
  providers: [UserSocketGateway, UserService],
})
export class UserSocketModule {}