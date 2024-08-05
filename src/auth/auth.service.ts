import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateUser(userEntity: any) {
    console.log(userEntity);

    const user = await this.prismaService.user.findUnique({
      where: { email: userEntity.email },
    });

    if (user) return user;

    const newUser = await this.prismaService.user.create({
      data: userEntity,
    });
    return newUser;
  }
}
