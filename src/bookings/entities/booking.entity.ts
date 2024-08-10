import { Booking } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BookingEntity implements Booking {
  @ApiProperty()
  id: string;

  @ApiProperty()
  checkInDate: Date;

  @ApiProperty()
  checkOutDate: Date;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  homestayId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(data: Partial<BookingEntity>) {
    Object.assign(this, data);
  }
}
