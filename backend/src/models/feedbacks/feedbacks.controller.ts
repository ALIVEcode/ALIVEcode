import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Auth } from '../../utils/decorators/auth.decorator';
import { Role } from '../../utils/types/roles.types';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return await this.feedbacksService.create(createFeedbackDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.feedbacksService.findAll();
  }

  @Get(':id')
  @Auth(Role.STAFF)
  async findOne(@Param('id') id: string) {
    return await this.feedbacksService.findOne(+id);
  }
}
