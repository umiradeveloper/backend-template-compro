import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly logs: ActivityLogsService,
  ) {}

  async login(email: string, password: string, ip?: string) {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email atau password salah');
    }
    if (!user.isActive) throw new UnauthorizedException('Akun Anda dinonaktifkan');
    await this.users.touchLogin(user.id);
    await this.logs.log({
      userId: user.id,
      userName: user.name,
      action: 'login',
      entity: 'auth',
      description: `${user.name} login`,
      ip,
    });
    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role });
    const fresh = await this.users.findOne(user.id);
    return { accessToken, user: fresh };
  }
}
