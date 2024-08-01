import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsDate } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  checkInDate: Date;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  checkOutDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  homestayId: string;
}
