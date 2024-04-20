import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'MongoDbCredentials' })
export class MongoDbCredentials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  resourceId: number;

  @Column()
  uri: string;

  @Column()
  databaseName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
