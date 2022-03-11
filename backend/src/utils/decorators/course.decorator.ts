import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { MyRequest } from '../guards/auth.guard';

export const Course = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as MyRequest;

  if (!request.course) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

  return request.course;
});