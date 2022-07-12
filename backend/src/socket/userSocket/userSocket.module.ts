import { Module } from '@nestjs/common';
import { IoTGateway } from './userSocket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../../models/user/user.service';
import { UserModule } from '../../models/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), UserModule],
  controllers: [IoTGateway],
  providers: [UserService],
})
export class UserSocketModule {}