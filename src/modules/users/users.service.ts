import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './users.dto';
import { paginated } from '../../common/dto/pagination.dto';
import { Role } from '../../common/enums';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findAll(q: UserQueryDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 10;
    const qb = this.repo.createQueryBuilder('u').orderBy('u.createdAt', 'DESC');
    if (q.search) qb.andWhere('(u.name LIKE :s OR u.email LIKE :s)', { s: `%${q.search}%` });
    if (q.role) qb.andWhere('u.role = :role', { role: q.role });
    const [rows, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return paginated(rows, total, page, limit);
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  findByEmailWithPassword(email: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async findByIdWithPassword(id: number) {
    return this.repo.createQueryBuilder('u').addSelect('u.password').where('u.id = :id', { id }).getOne();
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();
    if (await this.repo.exist({ where: { email } })) throw new ConflictException('Email sudah dipakai');
    const user = this.repo.create({ ...dto, email, password: await bcrypt.hash(dto.password, 10) });
    const saved = await this.repo.save(user);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateUserDto, actorId?: number) {
    const user = await this.findOne(id);
    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const email = dto.email.toLowerCase();
      if (await this.repo.exist({ where: { email } })) throw new ConflictException('Email sudah dipakai');
      user.email = email;
    }
    if (actorId === id && dto.isActive === false) throw new BadRequestException('Tidak bisa menonaktifkan akun sendiri');
    if (actorId === id && dto.role && dto.role !== user.role) throw new BadRequestException('Tidak bisa mengubah role akun sendiri');
    if (user.role === Role.SUPERADMIN && dto.role && dto.role !== Role.SUPERADMIN) await this.ensureAnotherSuperadmin(id);

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.avatar !== undefined) user.avatar = dto.avatar || null;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
    await this.repo.save(user);
    return this.findOne(id);
  }

  async updateProfile(id: number, data: { name?: string; avatar?: string | null; email?: string }) {
    return this.update(id, { name: data.name, avatar: data.avatar ?? undefined, email: data.email }, id);
  }

  async changePassword(id: number, current: string, next: string) {
    const user = await this.findByIdWithPassword(id);
    if (!user || !(await bcrypt.compare(current, user.password))) {
      throw new BadRequestException('Password lama salah');
    }
    await this.repo.update(id, { password: await bcrypt.hash(next, 10) });
    return { success: true };
  }

  async touchLogin(id: number) {
    await this.repo.update(id, { lastLoginAt: new Date() });
  }

  async remove(id: number, actorId: number) {
    if (id === actorId) throw new BadRequestException('Tidak bisa menghapus akun sendiri');
    const user = await this.findOne(id);
    if (user.role === Role.SUPERADMIN) await this.ensureAnotherSuperadmin(id);
    await this.repo.delete(id);
    return { success: true };
  }

  count() {
    return this.repo.count();
  }

  private async ensureAnotherSuperadmin(excludeId: number) {
    const count = await this.repo
      .createQueryBuilder('u')
      .where('u.role = :r AND u.id != :id AND u.isActive = 1', { r: Role.SUPERADMIN, id: excludeId })
      .getCount();
    if (count === 0) throw new BadRequestException('Minimal harus ada satu super admin aktif');
  }
}
