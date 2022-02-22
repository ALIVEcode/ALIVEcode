import { Response } from "express";
import { sign } from "jsonwebtoken"
import { Role } from '../../utils/types/roles.types';
import { UserEntity, ProfessorEntity, StudentEntity } from './entities/user.entity';

// TODO: Add secret key
export const createAccessToken = (user: UserEntity) => {
  return sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_DURATION },
  );
};

export const createRefreshToken = (user: UserEntity) => {
  return sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_DURATION },
  );
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie('wif', token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    httpOnly: true,
    path: '/api/users/refreshToken',
  });
};

export const hasRole = (user: UserEntity, ...roles: Array<Role>): boolean => {
  if (roles.length === 0) return true;
  return roles.some(role => {
    switch (role) {
      case Role.SUPER_USER:
        return user.isSuperUser;
      case Role.ADMIN:
        return user.isAdmin || user.isSuperUser;
      case Role.MOD:
        return user.isMod || user.isAdmin || user.isSuperUser;
      case Role.STAFF:
        return user.isSuperUser || user.isAdmin || user.isMod;
      case Role.PROFESSOR:
        return user instanceof ProfessorEntity;
      case Role.STUDENT:
        return user instanceof StudentEntity;
    }
  });
};
