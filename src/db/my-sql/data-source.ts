import 'dotenv/config'
import { DataSourceOptions, DataSource } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Resource } from '../../resources/entities/resource.entity';
import { ResourceUser } from '../../resource-users/entities/resource-user.entity';
import { MySqlCredentials } from '../../my-sql-credentials/entities/my-sql-credentials.entity';
import { DataStore } from '../../data-stores/entities/data-store.entity';
import { MongoDbCredentials } from '../../mongo-db-credentials/entities/mongo-db-credentials.entity';


export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_DB_HOST,
  port: 3306,
  username: process.env.MYSQL_DB_ADMIN_USERNAME,
  password: process.env.MYSQL_DB_ADMIN_PASSWORD,
  database: process.env.MYSQL_DB_DATABASE,
  entities: [User, Workspace, Resource, ResourceUser, MySqlCredentials, DataStore, MongoDbCredentials],
  migrations: ['dist/db/my-sql/migrations/*{.ts,.js}'],
  migrationsTableName: 'Migration',
  migrationsRun: false,
  synchronize: false
};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
