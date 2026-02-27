import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderQueryDto } from "./dto/order-query.dto";
import { ReorderQueueDto } from "./dto/reorder-queue.dto";
import { UpdateOrderStatusDto } from "./dto/order-status.dto";
import { OrdersService } from "./orders.service";

@Controller("api/orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async list(@Query() query: OrderQueryDto) {
    return this.ordersService.listOrders(query.status as OrderStatus | undefined);
  }

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Patch(":id/status")
  async status(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status as OrderStatus);
  }

  @Post("reorder")
  async reorder(@Body() dto: ReorderQueueDto) {
    return this.ordersService.reorderQueue(dto.orderedIds);
  }
}
