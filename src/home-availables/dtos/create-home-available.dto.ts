import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsDate, IsNotEmpty } from 'class-validator';

export class CreateHomeAvailableDto {
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  availableFrom: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  availableTo: Date;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  @ApiProperty()
  homestayId: string;
}
