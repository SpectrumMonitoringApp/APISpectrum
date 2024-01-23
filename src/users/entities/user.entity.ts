import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';

import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Workspace, (workspace) => workspace.users)
  @JoinTable({
    name: 'WorkspaceMapping',
    joinColumn: { name: 'principalId' },
    inverseJoinColumn: { name: 'workspaceId' }
  })
  workspaces: Workspace[];
}