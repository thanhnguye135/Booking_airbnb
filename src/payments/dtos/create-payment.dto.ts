import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsBoolean } from 'class-validator';

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
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  bookingId: string;
}
