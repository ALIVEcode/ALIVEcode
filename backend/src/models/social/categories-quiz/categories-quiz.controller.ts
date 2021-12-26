import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesQuizService } from './categories-quiz.service';
import { CreateCategoriesQuizDto } from './dto/create-categories-quiz.dto';
import { UpdateCategoriesQuizDto } from './dto/update-categories-quiz.dto';
import { CategoriesQuiz } from './entities/categories-quiz.entity';

@Controller('categories-quiz')
export class CategoriesQuizController {
  constructor(private readonly categoriesQuizService: CategoriesQuizService) {}

  @Post()
  create(@Body() createCategoriesQuizDto: CreateCategoriesQuizDto) {
    return this.categoriesQuizService.create(createCategoriesQuizDto);
  }

  @Get()
  findAll() {
    return this.categoriesQuizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesQuizService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriesQuizDto: CategoriesQuiz) {
    return this.categoriesQuizService.update(+id, updateCategoriesQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesQuizService.remove(+id);
  }
}
