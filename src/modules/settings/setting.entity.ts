import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryColumn({ length: 64 })
  key: string;

  @Column({ type: 'json' })
  data: Record<string, unknown>;

  @Column({ type: 'json' })
  translations: Record<string, Record<string, unknown>>;

  @UpdateDateColumn()
  updatedAt: Date;
}
