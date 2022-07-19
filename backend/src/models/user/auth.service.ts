import { Injectable, HttpException, HttpStatus, Scope, Inject } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { createAccessToken, setRefreshToken, createRefreshToken } from './auth';
import { verify } from 'jsonwebtoken';
import { AuthPayload } from '../../utils/types/auth.payload';
import { REQUEST } from '@nestjs/core';
import { MyRequest } from '../../utils/guards/auth.guard';
import { UserService } from './user.service';

/**
 * All the methods to communicate to the database regarding users.
 * @author Enric Soldevila
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(REQUEST)
    private req: MyRequest,
    private userService: UserService,
  ) {}
  async login(email: string, password: string, res: Response) {
    const user = await this.userService.findByEmail(email);

    const valid = await compare(password, user.password);
    if (!valid) {
      throw 'Error';
    }

    setRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  logout(res: Response) {
    setRefreshToken(res, '');
    return {};
  }

  async refreshToken(res: Response) {
    const req = this.req;

    const refreshToken = req.cookies.wif;
    if (!refreshToken) throw new HttpException('No credentials were provided', HttpStatus.UNAUTHORIZED);

    let payload: AuthPayload;

    try {
      payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY) as AuthPayload;
    } catch {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
    if (!payload) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

    const user = await this.userService.findById(payload.id);
    if (!user) throw new HttpException('No user found with given id', HttpStatus.UNAUTHORIZED);

    setRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }
}
