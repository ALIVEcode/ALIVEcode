import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './entities/quiz.entity';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async create(@Body() createQuizDto: Quiz) {
    console.log(createQuizDto)
    return await this.quizzesService.create(createQuizDto);
  }

  @Get()
  async findAll() {
    return await this.quizzesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: Quiz) {
    return this.quizzesService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.quizzesService.remove(+id);
  }
}
