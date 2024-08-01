import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateHomestayDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  pricePerNight: number;
}
