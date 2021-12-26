import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { DTOInterceptor } from '../../../utils/interceptors/dto.interceptor';

@Controller('results')
@UseInterceptors(DTOInterceptor)
export class ResultsController {
  [x: string]: any;
  constructor(private readonly resultsService: ResultsService) {}

  @Get('user')
  async getResults() {
    return await this.resultsService.getResults();
  }
  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Post('findandcount')
  async findAndCount(@Body('percentage') percentage: number) {
    const [, count] = await this.resultsService.findAndCount(percentage);
    return count;
  }

  @Get()
  findAll() {
    return this.resultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultsService.update(+id, updateResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultsService.remove(+id);
  }
}
