import { Module } from '@nestjs/common';
import { CarGateway } from './car.gateway';

@Module({
  providers: [CarGateway],
})
export class CarModule {}