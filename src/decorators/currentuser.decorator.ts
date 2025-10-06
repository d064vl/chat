import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Currentuser = createParamDecorator(
    (data: never, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        console.log('Currentuser', request.user)
        return request.user;
    })
