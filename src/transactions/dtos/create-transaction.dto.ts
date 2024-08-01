import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  status: boolean;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty()
  paymentId: string;
}
