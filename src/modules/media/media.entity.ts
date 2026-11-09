import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 255 })
  originalName: string;

  @Index()
  @Column({ length: 120 })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  /** path relatif yang bisa diakses publik, mis. /uploads/2026/11/abc.jpg */
  @Column({ length: 500 })
  path: string;

  @Index()
  @Column({ length: 60, default: 'general' })
  folder: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt: string | null;

  @Column({ type: 'int', nullable: true })
  uploadedById: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
