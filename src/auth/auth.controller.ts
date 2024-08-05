import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(GoogleOauthGuard)
  @Get('google/login')
  async login() {
    return { msg: 'google authentication' };
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google/redirect')
  async redirect() {
    return { msg: 'OK' };
  }

  @Get('google/status')
  status(@Req() req) {
    if (req.user) return { msg: 'authenticated' };
    return { msg: 'unauthenticated' };
  }
}
