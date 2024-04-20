import { ResourceType } from '../entities/resource.entity';

export class CreateMongoDbResourceDto {
  workspaceId: number;
  name: string;
  type: ResourceType;
  isActive: boolean;
  pollInterval: number;
  uri: string;
  databaseName: string;
}
