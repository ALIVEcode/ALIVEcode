import { Injectable } from '@nestjs/common';
import { ProfessorEntity, StudentEntity, UserEntity } from './models/user/entities/user.entity';

@Injectable()
export class AppService {
  getHello(user: UserEntity): string {
    if (user instanceof ProfessorEntity) {
      return `Hello ${user.firstName} ${user.lastName} !`;
    } else if (user instanceof StudentEntity) {
      return `Hello ${user.firstName} !`;
    }
    return `Hello !`;
  }
}
