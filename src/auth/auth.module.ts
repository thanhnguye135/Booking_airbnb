import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleOauthStrategy } from './strategies/google-oauth.strategy';
import { SessionSerializer } from './decorators/user.serialize';

@Module({
  providers: [AuthService, GoogleOauthStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
