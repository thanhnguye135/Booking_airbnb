import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDate,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ type: String, format: 'date-time' })
  checkInDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ type: String, format: 'date-time' })
  checkOutDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty()
  homestayId: string;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;
}
