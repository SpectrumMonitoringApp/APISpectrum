export class CreateMySqlCredentialsDto {
  resourceId: number;
  host: string;
  port: string;
  username: string;
  password: string;
  databaseName: string;
}
