import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'MySqlCredentials' })
export class MySqlCredentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  resourceId: number;

  @Column()
  host: string;

  @Column()
  port: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  databaseName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}