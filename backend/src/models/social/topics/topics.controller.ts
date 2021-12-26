import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicsDto } from './dto/create-topics.dto';
import { UpdateTopicsDto } from './dto/update-topics.dto';

@Controller('Topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  create(@Body() createTopicsDto: CreateTopicsDto) {
    return this.topicsService.create(createTopicsDto);
  }

  @Get()
  async findAll() {
    return await this.topicsService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicsDto: UpdateTopicsDto) {
    return this.topicsService.update(+id, updateTopicsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }
}
