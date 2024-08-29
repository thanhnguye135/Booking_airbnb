import { ApiProperty } from '@nestjs/swagger';

export class ChargePaymentDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;
}
