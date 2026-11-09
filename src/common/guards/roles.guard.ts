import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MIN_ROLE_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Role, ROLE_LEVEL } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets)) return true;

    const minRole = this.reflector.getAllAndOverride<Role>(MIN_ROLE_KEY, targets);
    if (!minRole) return true;

    const user = context.switchToHttp().getRequest().user;
    if (!user || ROLE_LEVEL[user.role as Role] < ROLE_LEVEL[minRole]) {
      throw new ForbiddenException('Anda tidak memiliki akses untuk aksi ini');
    }
    return true;
  }
}
