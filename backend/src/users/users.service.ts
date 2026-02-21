import { Injectable } from "@nestjs/common";
import { MembershipType, UserRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

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
      },
    });
  }
}
