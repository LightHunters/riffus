import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateUser(googleProfile: any) {
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleProfile.id },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: googleProfile.displayName || googleProfile.name?.familyName || 'User',
          googleId: googleProfile.id,
          avatar: googleProfile.photos?.[0]?.value || '',
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { googleId: googleProfile.id },
        data: {
          avatar: googleProfile.photos?.[0]?.value || user.avatar,
        },
      });
    }

    return user;
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });
  }

  async updateUser(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
