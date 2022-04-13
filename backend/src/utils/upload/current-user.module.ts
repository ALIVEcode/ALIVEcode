import { Module, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { MyRequest } from '../guards/auth.guard';

@Module({
  providers: [
    {
      provide: 'CURRENT_USER',
      inject: [REQUEST],
      useFactory: (req: MyRequest) => req.user,
      scope: Scope.REQUEST,
    },
  ],
  exports: ['CURRENT_USER'],
})
export class CurrentUserModule {}
