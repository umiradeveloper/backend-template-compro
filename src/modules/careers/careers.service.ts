import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career, CareerTranslation } from './career.entity';
import { TranslatableContentService } from '../../common/content/translatable-content.service';
import { ContentStatus } from '../../common/enums';

@Injectable()
export class CareersService extends TranslatableContentService<Career, CareerTranslation> {
  protected readonly label = 'Lowongan';
  protected readonly parentKey = 'careerId';
  protected readonly scalarFields = [
    'publishedAt', 'closingDate', 'department', 'location', 'employmentType', 'applyEmail', 'applyUrl', 'coverImage', 'galleryImg',
  ];
  protected readonly translationFields = ['detail', 'excerpt', 'content'];
  protected readonly sortable = ['createdAt', 'updatedAt', 'publishedAt', 'closingDate', 'slug', 'status', 'id'];
  protected readonly defaultSort = { field: 'publishedAt', order: 'DESC' as const };

  constructor(
    @InjectRepository(Career) repo: Repository<Career>,
    @InjectRepository(CareerTranslation) tr: Repository<CareerTranslation>,
  ) {
    super(repo, tr);
  }

  protected beforeSave(entity: Career) {
    if (entity.status === ContentStatus.PUBLISHED && !entity.publishedAt) entity.publishedAt = new Date();
  }

  async countOpen() {
    return this.repo
      .createQueryBuilder('c')
      .where('c.status = :s', { s: ContentStatus.PUBLISHED })
      .andWhere('(c.closingDate IS NULL OR c.closingDate >= CURDATE())')
      .getCount();
  }

  isOpen(c: Career) {
    return !c.closingDate || c.closingDate >= new Date().toISOString().slice(0, 10);
  }

  toPublic(c: Career, locale: string, withContent = false) {
    const t = this.pickTranslation(c, locale);
    const out: Record<string, unknown> = {
      id: c.id,
      slug: c.slug,
      title: t?.title ?? '',
      detail: t?.detail ?? '',
      date: c.publishedAt ? new Date(c.publishedAt).toISOString().slice(0, 10) : null,
      closingDate: c.closingDate,
      isOpen: this.isOpen(c),
      department: c.department,
      location: c.location,
      employmentType: c.employmentType,
      applyEmail: c.applyEmail,
      applyUrl: c.applyUrl,
      coverImage: c.coverImage,
      galleryImg: c.galleryImg,
      scrolltoread: t?.excerpt ?? '',
      metaTitle: t?.metaTitle || t?.title,
      metaDescription: t?.metaDescription || t?.excerpt,
      locale: t?.locale ?? locale,
    };
    if (withContent) out.content = t?.content ?? '';
    return out;
  }
}
