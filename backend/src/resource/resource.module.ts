import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from './entities/resource.entity';
import { UserEntity } from '../models/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity, UserEntity])],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
