import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent, BaseTranslation } from '../../common/content/base.entities';

@Entity('blogs')
export class Blog extends BaseContent {
  @Index()
  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImage: string | null;

  /** gambar besar di halaman detail */
  @Column({ type: 'varchar', length: 500, nullable: true })
  galleryImg: string | null;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'varchar', length: 300, nullable: true })
  tags: string | null;

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => BlogTranslation, (t) => t.blog, { cascade: false })
  translations: BlogTranslation[];
}

@Entity('blog_translations')
@Index(['blogId', 'locale'], { unique: true })
export class BlogTranslation extends BaseTranslation {
  @Column()
  blogId: number;

  @ManyToOne(() => Blog, (b) => b.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: Blog;

  /** sub judul / lokasi singkat (frontmatter "detail") */
  @Column({ type: 'varchar', length: 255, nullable: true })
  detail: string | null;

  /** ringkasan (frontmatter "scrolltoread") */
  @Column({ type: 'text', nullable: true })
  excerpt: string | null;

  /** isi artikel dalam format Markdown */
  @Column({ type: 'longtext', nullable: true })
  content: string | null;
}
