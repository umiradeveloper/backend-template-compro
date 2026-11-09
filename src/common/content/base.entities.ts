import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ContentStatus } from '../enums';

/** Kolom bersama untuk konten yang punya terjemahan (blog, proyek, karir) */
export abstract class BaseContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 191 })
  slug: string;

  @Index()
  @Column({ type: 'enum', enum: ContentStatus, default: ContentStatus.DRAFT })
  status: ContentStatus;

  @Column({ type: 'int', nullable: true })
  createdById: number | null;

  @Column({ type: 'int', nullable: true })
  updatedById: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

export abstract class BaseTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 5 })
  locale: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metaTitle: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  metaDescription: string | null;
}
