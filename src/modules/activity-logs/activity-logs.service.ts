import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './activity-log.entity';
import { paginated, PaginationQueryDto } from '../../common/dto/pagination.dto';

export interface LogInput {
  userId?: number | null;
  userName?: string | null;
  action: string;
  entity: string;
  entityId?: string | number | null;
  description?: string | null;
  ip?: string | null;
}

@Injectable()
export class ActivityLogsService {
  private readonly logger = new Logger(ActivityLogsService.name);
  constructor(@InjectRepository(ActivityLog) private readonly repo: Repository<ActivityLog>) {}

  async log(input: LogInput) {
    try {
      await this.repo.insert({
        userId: input.userId ?? null,
        userName: input.userName ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId != null ? String(input.entityId) : null,
        description: input.description?.slice(0, 500) ?? null,
        ip: input.ip ?? null,
      });
    } catch (e) {
      this.logger.warn(`Gagal mencatat activity log: ${(e as Error).message}`);
    }
  }

  async findAll(q: PaginationQueryDto & { entity?: string; action?: string; userId?: number }) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const qb = this.repo.createQueryBuilder('l').orderBy('l.createdAt', 'DESC').addOrderBy('l.id', 'DESC');
    if (q.search) qb.andWhere('(l.description LIKE :s OR l.userName LIKE :s)', { s: `%${q.search}%` });
    if (q.entity) qb.andWhere('l.entity = :entity', { entity: q.entity });
    if (q.action) qb.andWhere('l.action = :action', { action: q.action });
    if (q.userId) qb.andWhere('l.userId = :userId', { userId: q.userId });
    const [rows, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return paginated(rows, total, page, limit);
  }

  recent(limit = 8) {
    return this.repo.find({ order: { createdAt: 'DESC', id: 'DESC' }, take: limit });
  }

  async clearOlderThan(days: number) {
    const res = await this.repo
      .createQueryBuilder()
      .delete()
      .where('createdAt < DATE_SUB(NOW(), INTERVAL :days DAY)', { days })
      .execute();
    return { deleted: res.affected ?? 0 };
  }
}
