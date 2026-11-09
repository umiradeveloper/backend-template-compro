import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent, BaseTranslation } from '../../common/content/base.entities';

@Entity('projects')
export class Project extends BaseContent {
  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImage: string | null;

  @Column({ type: 'json', nullable: true })
  gallery: string[] | null;

  /** luas area, mis. "5,822 m²" (frontmatter "raised") */
  @Column({ type: 'varchar', length: 120, nullable: true })
  area: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  client: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  year: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  projectStatus: string | null;

  @Column({ default: false })
  isFeatured: boolean;

  @Index()
  @Column({ default: 0 })
  sortOrder: number;

  @OneToMany(() => ProjectTranslation, (t) => t.project)
  translations: ProjectTranslation[];
}

@Entity('project_translations')
@Index(['projectId', 'locale'], { unique: true })
export class ProjectTranslation extends BaseTranslation {
  @Column()
  projectId: number;

  @ManyToOne(() => Project, (p) => p.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'varchar', length: 160, nullable: true })
  industry: string | null;

  /** lingkup pekerjaan / tag, mis. ["Villa","Apartment"] */
  @Column({ type: 'json', nullable: true })
  scopeOfWork: string[] | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'longtext', nullable: true })
  content: string | null;
}
