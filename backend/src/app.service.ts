import { Injectable } from '@nestjs/common';
import { UserEntity, ProfessorEntity, StudentEntity } from './models/user/entities/user.entity';

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
