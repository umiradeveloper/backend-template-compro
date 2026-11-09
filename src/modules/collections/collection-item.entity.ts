import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/** Satu item di koleksi konten (layanan, tim, FAQ, partner, dll.) */
@Entity('collection_items')
@Index(['collection', 'sortOrder'])
export class CollectionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  collection: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  /** nilai field yang tidak diterjemahkan */
  @Column({ type: 'json' })
  data: Record<string, unknown>;

  /** { en: {...}, id: {...} } */
  @Column({ type: 'json' })
  translations: Record<string, Record<string, unknown>>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
