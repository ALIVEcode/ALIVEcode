import { Module, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { MyRequest } from '../guards/auth.guard';
import { AuthService } from '../../models/user/auth.service';
import { UserService } from '../../models/user/user.service';
import { UserModule } from '../../models/user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: 'CURRENT_REQUEST',
      inject: [REQUEST],
      useFactory: (req: MyRequest) => req.user,
      scope: Scope.REQUEST,
    },
    UserService,
    AuthService,
  ],
  exports: [AuthService, 'CURRENT_REQUEST'],
})
export class CurrentRequestModule {}
