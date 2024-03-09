import { UpdateResourceDto } from './update-resource.dto';
import { UpdateResourceCredentialsDto } from './update-resource-credentials.dto';

export class UpdateResourceRequestBodyDto {
  resource: UpdateResourceDto;
  resourceCredentials: UpdateResourceCredentialsDto;
}
