import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesSubjectsService } from './categories-subjects.service';
import { CreateCategoriesSubjectDto } from './dto/create-categories-subject.dto';
import { UpdateCategoriesSubjectDto } from './dto/update-categories-subject.dto';

@Controller('categories-subjects')
export class CategoriesSubjectsController {
  constructor(private readonly categoriesSubjectsService: CategoriesSubjectsService) {}

  @Post()
  create(@Body() createCategoriesSubjectDto: CreateCategoriesSubjectDto) {
    return this.categoriesSubjectsService.create(createCategoriesSubjectDto);
  }

  @Get()
  findAll() {
    return this.categoriesSubjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesSubjectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriesSubjectDto: UpdateCategoriesSubjectDto) {
    return this.categoriesSubjectsService.update(+id, updateCategoriesSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesSubjectsService.remove(+id);
  }
}
