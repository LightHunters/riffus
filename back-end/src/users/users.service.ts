import { Injectable, ConflictException, BadRequestException } from "@nestjs/common";
import { MembershipType, UserRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateDemoUser(role: UserRole = "customer") {
    const name = role === "owner" ? "Cafe Owner" : "Guest";
    const avatar =
      role === "owner"
        ? "https://i.pravatar.cc/120?img=12"
        : "https://i.pravatar.cc/120?img=5";
    const membershipType: MembershipType = role === "owner" ? "Gold" : "Guest";

    const existing = await this.prisma.user.findFirst({
      where: { role, name },
    });
    if (existing) {
      return existing;
    }

    return this.prisma.user.create({
      data: {
        name,
        role,
        avatar,
        membershipType,
        email:'guess@riffus.com',
      },
    });
  }
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
          email: googleProfile.email
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

  async signup(email: string, password: string, name: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'customer',
      },
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
