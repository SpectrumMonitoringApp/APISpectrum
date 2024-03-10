import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';

import { Resource } from '../../resources/entities/resource.entity';

@Entity({ name: 'DataStore' })
export class DataStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  resourceId: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Resource, (resource) => resource.dataStores)
  resource: Resource
}