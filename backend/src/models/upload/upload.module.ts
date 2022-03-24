import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UploadsEntity } from './entities/upload.entity';
import { UploadsController } from './upload.controller';
import { UploadsService } from './upload.service';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadModule {}
