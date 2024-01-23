export class CreateMySqlCredentialsDto {
  resourceId: number;
  host: string;
  port: number;
  username: string;
  password: string;
  databaseName: string;
}
