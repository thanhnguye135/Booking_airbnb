import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  status: boolean;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty()
  bookingId: string;
}
