import { Injectable, ExecutionContext, Inject, CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { hasRole } from '../../models/user/auth';
import { Role } from '../types/roles.types';
import { MyRequest } from './auth.guard';
import { UserService } from '../../models/user/user.service';
import { ResourceService } from '../../models/resource/resource.service';

@Injectable()
export class ResourceCreator implements CanActivate {
  constructor(
    public resourceService: ResourceService,
    public userService: UserService,
    @Inject(REQUEST) public req: MyRequest,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.req.resource != null) return true;

    const resourceId = this.req.params.id;
    if (!resourceId) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);

    const user = this.req.user;
    if (!user) throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);

    const resource = await this.resourceService.findOne(resourceId);

    if (hasRole(user, Role.STAFF)) {
      this.req.resource = resource;
      return true;
    }

    if (resource.creator.id === user.id) {
      this.req.resource = resource;
      return true;
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}