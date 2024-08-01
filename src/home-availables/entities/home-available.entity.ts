import { HomeAvailable } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class HomeAvailableEntity implements HomeAvailable {
  @ApiProperty()
  id: string;

  @ApiProperty()
  availableFrom: Date;

  @ApiProperty()
  availableTo: Date;

  @ApiProperty()
  homestayId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
