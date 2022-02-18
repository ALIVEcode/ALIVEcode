import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';

@Module({
  controllers: [RewardsController],
  providers: [RewardsService]
})
export class RewardsModule {}
