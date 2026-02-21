import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { buildQueuePositions } from "./orders.utils";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async listOrders(status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: status ? { status } : {},
      include: { song: true, user: true },
      orderBy: [{ queuePosition: "asc" }, { createdAt: "asc" }],
    });
  }

  async createOrder(dto: CreateOrderDto) {
    const [user, song] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.userId } }),
      this.prisma.song.findUnique({ where: { id: dto.songId } }),
    ]);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!song) {
      throw new NotFoundException("Song not found");
    }

    const queued = await this.prisma.order.findFirst({
      where: { status: "queued" },
      orderBy: { queuePosition: "desc" },
      select: { queuePosition: true },
    });
    const queuePosition = (queued?.queuePosition ?? 0) + 1;

    return this.prisma.order.create({
      data: {
        userId: dto.userId,
        songId: dto.songId,
        status: "queued",
        queuePosition,
      },
      include: { song: true, user: true },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    const existing = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!existing) {
      throw new NotFoundException("Order not found");
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { song: true, user: true },
    });
  }

  async reorderQueue(orderedIds: string[]) {
    const positions = buildQueuePositions(orderedIds);
    await this.prisma.$transaction(
      positions.map((item) =>
        this.prisma.order.updateMany({
          where: { id: item.id, status: "queued" },
          data: { queuePosition: item.queuePosition },
        }),
      ),
    );
    return { reordered: true };
  }
}
