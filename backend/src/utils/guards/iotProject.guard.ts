import { Injectable, ExecutionContext, Inject, CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { hasRole } from '../../models/user/auth';
import { Role } from '../types/roles.types';
import { MyRequest } from './auth.guard';
import { UserService } from '../../models/user/user.service';
import { IoTProjectService } from '../../models/iot/IoTproject/IoTproject.service';

@Injectable()
export class IoTProjectCreator implements CanActivate {
  constructor(
    public projectService: IoTProjectService,
    public userService: UserService,
    @Inject(REQUEST) public req: MyRequest,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.req.iotProject != null) return true;

    const projectId = this.req.params.id;
    if (!projectId) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);

    const user = this.req.user;
    if (!user) throw new HttpException('You are not logged in', HttpStatus.UNAUTHORIZED);

    const project = await this.projectService.findOne(projectId);

    if (hasRole(user, Role.STAFF) || project.creator.id === user.id) {
      this.req.iotProject = project;
      return true;
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}