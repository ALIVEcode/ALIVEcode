import { Module } from '@nestjs/common';
import { CategoriesSubjectsService } from './categories-subjects.service';
import { CategoriesSubjectsController } from './categories-subjects.controller';
import { CategoriesSubject } from './entities/categories-subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoriesSubject,
    ]),
  ],
  controllers: [CategoriesSubjectsController],
  providers: [CategoriesSubjectsService]
})
export class CategoriesSubjectsModule {}
