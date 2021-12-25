import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardsService.create(createRewardDto);
  }

  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardsService.update(+id, updateRewardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardsService.remove(+id);
  }
}
