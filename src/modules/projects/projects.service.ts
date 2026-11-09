import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectTranslation } from './project.entity';
import { TranslatableContentService } from '../../common/content/translatable-content.service';

@Injectable()
export class ProjectsService extends TranslatableContentService<Project, ProjectTranslation> {
  protected readonly label = 'Proyek';
  protected readonly parentKey = 'projectId';
  protected readonly scalarFields = [
    'coverImage', 'gallery', 'area', 'website', 'location', 'client', 'year', 'projectStatus', 'isFeatured', 'sortOrder',
  ];
  protected readonly translationFields = ['industry', 'scopeOfWork', 'description', 'content'];
  protected readonly sortable = ['createdAt', 'updatedAt', 'sortOrder', 'slug', 'status', 'year', 'id'];
  protected readonly defaultSort = { field: 'sortOrder', order: 'ASC' as const };

  constructor(
    @InjectRepository(Project) repo: Repository<Project>,
    @InjectRepository(ProjectTranslation) tr: Repository<ProjectTranslation>,
  ) {
    super(repo, tr);
  }

  async reorder(ids: number[]) {
    await Promise.all(ids.map((id, i) => this.repo.update(id, { sortOrder: i })));
    return { success: true };
  }

  /** Bentuk data untuk website (kompatibel dengan frontmatter MDX lama) */
  toPublic(p: Project, locale: string, withContent = false) {
    const t = this.pickTranslation(p, locale);
    const out: Record<string, unknown> = {
      id: p.id,
      slug: p.slug,
      title: t?.title ?? '',
      ScopeOfWork: t?.scopeOfWork ?? [],
      industry: t?.industry ?? '',
      raised: p.area ?? '',
      website: p.website ?? '',
      location: p.location,
      client: p.client,
      year: p.year,
      projectStatus: p.projectStatus,
      description: t?.description ?? '',
      coverImage: p.coverImage,
      gallery: p.gallery ?? [],
      isFeatured: p.isFeatured,
      metaTitle: t?.metaTitle || t?.title,
      metaDescription: t?.metaDescription || t?.description,
      locale: t?.locale ?? locale,
    };
    if (withContent) out.content = t?.content ?? '';
    return out;
  }
}
