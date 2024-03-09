import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import { ResourceUser } from '../../resource-users/entities/resource-user.entity';

export enum ResourceType {
  MYSQL = 'mySql',
  MONGODB = 'mongoDb',
  S3 = 's3',
}

@Entity({ name: 'Resource' })
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  workspaceId: number;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: ResourceType,
    nullable: false
  })
  type: ResourceType;

  @Column({ nullable: false })
  isActive: boolean;

  @Column()
  pollInterval: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ResourceUser, (resourceUser) => resourceUser.resource)
  resourceUsers: ResourceUser[];
}