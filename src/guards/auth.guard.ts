import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = ctx.switchToHttp().getRequest();

    console.log('guard admin', request.user, request.params)

    return request.user;
    // if request.session.userId exits then the guard allow to continue
    // otherwise the reuqest is rejected
  }
}
