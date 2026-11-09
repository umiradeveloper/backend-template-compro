import { Column, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * Teks statis website (label, judul section, visi-misi, dll.) per bahasa.
 * key memakai notasi titik, mis. "AboutDetail.mission.0" — sama dengan file message next-intl.
 */
@Entity('site_texts')
@Index(['locale', 'key'], { unique: true })
export class SiteText {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 5 })
  locale: string;

  @Column({ length: 191 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
