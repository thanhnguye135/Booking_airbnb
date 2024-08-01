import { Module } from '@nestjs/common';
import { HomestaysService } from './homestays.service';
import { HomestaysController } from './homestays.controller';

@Module({
  providers: [HomestaysService],
  controllers: [HomestaysController],
})
export class HomestaysModule {}
