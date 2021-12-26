import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { DTOInterceptor } from '../../../utils/interceptors/dto.interceptor';
import { Quiz } from './entities/quiz.entity';

@Controller('quizzes')
@UseInterceptors(DTOInterceptor)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async create(@Body() createQuizDto: Quiz) {
    console.log(createQuizDto);
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
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(+id);
  }
}
