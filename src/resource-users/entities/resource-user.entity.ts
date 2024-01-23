import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';

import { Resource } from '../../resources/entities/resource.entity';

export enum ResourceUserRole {
  ADMIN = 'admin',
  VIEWER = 'viewer'
}

@Entity({ name: 'ResourceUser' })
export class ResourceUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  resourceId: number;

  @Column({ nullable: false })
  userId: number;

  @Column({
    type: 'enum',
    enum: ResourceUserRole,
    nullable: false
  })
  role: ResourceUserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Resource, (resource) => resource.resourceUsers)
  resource: Resource;
}