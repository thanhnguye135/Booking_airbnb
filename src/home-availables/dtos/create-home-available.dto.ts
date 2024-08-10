import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHomeAvailableDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({ type: String, format: 'date-time' })
  availableFrom: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({ type: String, format: 'date-time' })
  availableTo: Date;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  homestayId: string;
}
