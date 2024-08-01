import { Module } from '@nestjs/common';
import { HomeAvailablesController } from './home-availables.controller';
import { HomeAvailablesService } from './home-availables.service';

@Module({
  controllers: [HomeAvailablesController],
  providers: [HomeAvailablesService],
})
export class HomeAvailablesModule {}
