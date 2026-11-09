import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 160, unique: true })
  email: string;

  @Exclude()
  @Column({ length: 255, select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.EDITOR })
  role: Role;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
