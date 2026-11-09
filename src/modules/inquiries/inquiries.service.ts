import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Inquiry } from './inquiry.entity';
import { CreateInquiryDto, InquiryQueryDto, UpdateInquiryDto } from './inquiries.dto';
import { paginated } from '../../common/dto/pagination.dto';
import { InquiryStatus } from '../../common/enums';

@Injectable()
export class InquiriesService {
  constructor(@InjectRepository(Inquiry) private readonly repo: Repository<Inquiry>) {}

  async create(dto: CreateInquiryDto, meta: { ip?: string; userAgent?: string }) {
    // honeypot terisi = bot; pura-pura sukses
    if (dto.website) return { success: true };
    const { website: _hp, ...data } = dto;
    await this.repo.save(this.repo.create({ ...data, source: dto.source ?? 'website', ip: meta.ip ?? null, userAgent: meta.userAgent?.slice(0, 300) ?? null }));
    return { success: true };
  }

  async findAll(q: InquiryQueryDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 15;
    const qb = this.repo.createQueryBuilder('i').orderBy('i.createdAt', 'DESC').addOrderBy('i.id', 'DESC');
    if (q.status) qb.andWhere('i.status = :status', { status: q.status });
    if (q.search) {
      qb.andWhere('(i.name LIKE :s OR i.email LIKE :s OR i.message LIKE :s OR i.company LIKE :s OR i.subject LIKE :s)', {
        s: `%${q.search}%`,
      });
    }
    const [rows, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return paginated(rows, total, page, limit);
  }

  async findOne(id: number, markRead = false) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Pesan tidak ditemukan');
    if (markRead && item.status === InquiryStatus.NEW) {
      item.status = InquiryStatus.READ;
      await this.repo.update(id, { status: InquiryStatus.READ });
    }
    return item;
  }

  async update(id: number, dto: UpdateInquiryDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.delete(id);
    return { id, name: item.name, success: true };
  }

  async bulkStatus(ids: number[], status: InquiryStatus) {
    const res = await this.repo.update({ id: In(ids) }, { status });
    return { updated: res.affected ?? 0 };
  }

  async bulkRemove(ids: number[]) {
    const res = await this.repo.delete(ids);
    return { deleted: res.affected ?? 0 };
  }

  async counts() {
    const rows = await this.repo
      .createQueryBuilder('i')
      .select('i.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('i.status')
      .getRawMany<{ status: string; count: string }>();
    const out: Record<string, number> = { total: 0, new: 0, read: 0, replied: 0, archived: 0 };
    for (const r of rows) {
      out[r.status] = Number(r.count);
      out.total += Number(r.count);
    }
    return out;
  }

  recent(limit = 5) {
    return this.repo.find({ order: { createdAt: 'DESC' }, take: limit });
  }

  /** jumlah pesan per bulan, n bulan terakhir */
  async monthly(months = 6) {
    const rows = await this.repo
      .createQueryBuilder('i')
      .select("DATE_FORMAT(i.createdAt, '%Y-%m')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('i.createdAt >= DATE_SUB(DATE_FORMAT(NOW(), "%Y-%m-01"), INTERVAL :m MONTH)', { m: months - 1 })
      .groupBy('month')
      .getRawMany<{ month: string; count: string }>();
    const out: { month: string; count: number }[] = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      out.push({ month: key, count: Number(rows.find((r) => r.month === key)?.count ?? 0) });
    }
    return out;
  }

  async exportCsv(q: InquiryQueryDto) {
    const { data } = await this.findAll({ ...q, page: 1, limit: 200 });
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
    const header = ['ID', 'Tanggal', 'Nama', 'Email', 'Telepon', 'Perusahaan', 'Subjek', 'Pesan', 'Status'];
    const lines = data.map((i) =>
      [i.id, i.createdAt.toISOString(), i.name, i.email, i.phone, i.company, i.subject, i.message, i.status].map(esc).join(','),
    );
    return [header.join(','), ...lines].join('\n');
  }
}
