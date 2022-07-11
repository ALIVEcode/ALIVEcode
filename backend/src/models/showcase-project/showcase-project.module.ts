import { Module } from '@nestjs/common';
import { ShowcaseProjectService } from './showcase-project.service';
import { ShowcaseProjectController } from './showcase-project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowcaseProjectEntity } from './entities/showcase-project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShowcaseProjectEntity])],
  controllers: [ShowcaseProjectController],
  providers: [ShowcaseProjectService],
})
export class ShowcaseProjectModule {}
