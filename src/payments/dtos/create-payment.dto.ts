import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
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
  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

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
