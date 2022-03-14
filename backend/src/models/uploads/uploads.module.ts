import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UploadsEntity } from './entities/upload.entity';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
