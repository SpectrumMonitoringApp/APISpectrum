import { ResourceType } from '../entities/resource.entity';

export class CreateMySqlResourceDto {
  workspaceId: number;
  name: string;
  type: ResourceType;
  host: string;
  port: number;
  username: string;
  password: string;
  databaseName: string;
}
