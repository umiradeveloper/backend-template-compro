import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', nullable: true })
  userId: number | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  userName: string | null;

  /** create | update | delete | login | upload | ... */
  @Column({ length: 30 })
  action: string;

  @Index()
  @Column({ length: 60 })
  entity: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  entityId: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip: string | null;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
