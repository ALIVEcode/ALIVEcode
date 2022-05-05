import { NextFunction } from "express";
import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaintenanceEntity } from '../../models/maintenance/entities/maintenance.entity';
import { Repository } from 'typeorm';
import { MyRequest } from '../guards/auth.guard';
import { verify, JsonWebTokenError } from 'jsonwebtoken';
import { UserEntity } from '../../models/user/entities/user.entity';
import { AuthPayload } from '../types/auth.payload';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(MaintenanceEntity) private maintenanceRepo: Repository<MaintenanceEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) {}
  async use(req: MyRequest, res: Response, next: NextFunction) {
    let user: UserEntity | null;
    try {
      const authorization = req.headers['authorization'];
      if (!authorization) return next();

      const accessToken = authorization.split(' ')[1];
      const payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
      if (!payload) return next();

      const authPayload = payload as AuthPayload;
      user = await this.userRepository.findOne(authPayload.id);
      req.user = user;
    } catch (err) {
      if (err instanceof JsonWebTokenError && err.name === 'TokenExpiredError') req.expiredToken = true;
    }

    next();
  }
}
