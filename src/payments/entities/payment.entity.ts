import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '@prisma/client';

export class PaymentEntity implements Payment {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  bookingId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
