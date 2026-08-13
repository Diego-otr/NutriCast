import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Account } from '../../accounts/entities/account.entity';

export const CurrentAccount = createParamDecorator(
  (data: keyof Account | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: Account }>();
    const account = request.user;

    return data ? account?.[data] : account;
  },
);
