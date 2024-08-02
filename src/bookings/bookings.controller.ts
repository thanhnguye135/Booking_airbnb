import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
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

@Controller('bookings')
@ApiTags('Bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOkResponse({ status: 200, type: BookingEntity, isArray: true })
  async getAll() {
    return this.bookingsService.getAllBookings();
  }

  @Get(':id')
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
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: BookingEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(@Param('id') id: string, updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.updateBooking(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async remove(@Param('id') id: string) {
    return this.bookingsService.deleteBooking(id);
  }
}
