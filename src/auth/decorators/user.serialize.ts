import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    console.log('serialize user');
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    console.log('deserialize user');
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
    });

    console.log(user);
    return user ? done(null, user) : done(null, null);
  }
}
