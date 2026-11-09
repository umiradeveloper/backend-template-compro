import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseContent, BaseTranslation } from '../../common/content/base.entities';

@Entity('careers')
export class Career extends BaseContent {
  @Index()
  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date | null;

  /** batas akhir lamaran; setelah lewat, lowongan tidak tampil di website */
  @Column({ type: 'date', nullable: true })
  closingDate: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  department: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  location: string | null;

  /** full-time | part-time | contract | internship | trainee */
  @Column({ type: 'varchar', length: 40, nullable: true })
  employmentType: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  applyEmail: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  applyUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImage: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  galleryImg: string | null;

  @OneToMany(() => CareerTranslation, (t) => t.career)
  translations: CareerTranslation[];
}

@Entity('career_translations')
@Index(['careerId', 'locale'], { unique: true })
export class CareerTranslation extends BaseTranslation {
  @Column()
  careerId: number;

  @ManyToOne(() => Career, (c) => c.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'careerId' })
  career: Career;

  @Column({ type: 'varchar', length: 255, nullable: true })
  detail: string | null;

  @Column({ type: 'text', nullable: true })
  excerpt: string | null;

  @Column({ type: 'longtext', nullable: true })
  content: string | null;
}
