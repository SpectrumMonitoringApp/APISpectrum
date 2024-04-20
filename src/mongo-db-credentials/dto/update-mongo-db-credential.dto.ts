import { PartialType } from '@nestjs/mapped-types';
import { CreateMongoDbCredentialDto } from './create-mongo-db-credential.dto';

export class UpdateMongoDbCredentialDto extends PartialType(CreateMongoDbCredentialDto) {}
