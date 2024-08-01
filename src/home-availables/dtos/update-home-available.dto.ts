import { PartialType } from '@nestjs/swagger';
import { CreateHomeAvailableDto } from './create-home-available.dto';

export class UpdateHomeAvailableDto extends PartialType(
  CreateHomeAvailableDto,
) {}
