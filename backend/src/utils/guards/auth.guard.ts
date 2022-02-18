import { Injectable, CanActivate, ExecutionContext, Scope, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { Reflector, REQUEST } from '@nestjs/core';
import { hasRole } from '../../models/user/auth';
import { Role } from '../types/roles.types';
import { ClassroomEntity } from '../../models/classroom/entities/classroom.entity';
import { UserEntity } from '../../models/user/entities/user.entity';

export interface MyRequest extends Request {
  user: UserEntity;
  classroom?: ClassroomEntity;
  expiredToken?: boolean;
}

@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private req: MyRequest,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      let roles = this.reflector.get<Role[]>('roles', context.getHandler());
      if (!roles) roles = [];

      const user = this.req.user;
      if (!user || this.req.expiredToken) throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);

      if (!hasRole(user, ...roles)) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      this.req.user = user;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
  }

}