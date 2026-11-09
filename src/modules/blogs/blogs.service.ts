import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog, BlogTranslation } from './blog.entity';
import { TranslatableContentService } from '../../common/content/translatable-content.service';
import { ContentStatus } from '../../common/enums';

@Injectable()
export class BlogsService extends TranslatableContentService<Blog, BlogTranslation> {
  protected readonly label = 'Artikel';
  protected readonly parentKey = 'blogId';
  protected readonly scalarFields = ['publishedAt', 'coverImage', 'galleryImg', 'isFeatured', 'tags'];
  protected readonly translationFields = ['detail', 'excerpt', 'content'];
  protected readonly sortable = ['createdAt', 'updatedAt', 'publishedAt', 'slug', 'status', 'views', 'id'];
  protected readonly defaultSort = { field: 'publishedAt', order: 'DESC' as const };

  constructor(@InjectRepository(Blog) repo: Repository<Blog>, @InjectRepository(BlogTranslation) tr: Repository<BlogTranslation>) {
    super(repo, tr);
  }

  protected beforeSave(entity: Blog) {
    if (entity.status === ContentStatus.PUBLISHED && !entity.publishedAt) entity.publishedAt = new Date();
  }

  incrementViews(id: number) {
    return this.repo.increment({ id }, 'views', 1);
  }

  /** Bentuk data untuk website (kompatibel dengan frontmatter MDX lama) */
  toPublic(blog: Blog, locale: string, withContent = false) {
    const t = this.pickTranslation(blog, locale);
    const date = blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 10) : null;
    const base: Record<string, unknown> = {
      id: blog.id,
      slug: blog.slug,
      title: t?.title ?? '',
      detail: t?.detail ?? '',
      date,
      coverImage: blog.coverImage,
      galleryImg: blog.galleryImg,
      scrolltoread: t?.excerpt ?? '',
      isFeatured: blog.isFeatured,
      tags: blog.tags ? blog.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      metaTitle: t?.metaTitle || t?.title,
      metaDescription: t?.metaDescription || t?.excerpt,
      locale: t?.locale ?? locale,
    };
    if (withContent) base.content = t?.content ?? '';
    return base;
  }
}
