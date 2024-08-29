import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { BookingsService } from './bookings.service';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Response } from 'express';

@Controller('bookings')
@ApiTags('Bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  // @CacheKey('all-bookings')
  // @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: BookingEntity, isArray: true })
  async getAll() {
    return this.bookingsService.getAllBookings();
  }

  @Get(':id')
  // @CacheKey('one-booking')
  // @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: BookingEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async get(@Param('id') id: string) {
    return this.bookingsService.getBooking(id);
  }

  @Post()
  @ApiCreatedResponse({
    status: 201,
    type: BookingEntity,
    isArray: false,
    description: 'Created Successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Res() res: Response,
  ) {
    return this.bookingsService.createBooking(createBookingDto, res);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: BookingEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.updateBooking(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.bookingsService.deleteBooking(id);
  }
}
