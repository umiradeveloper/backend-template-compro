import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../enums';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthUser => {
  return ctx.switchToHttp().getRequest().user;
});
