import { SongModel } from "@/models/Song";
import { UserModel } from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { toOrderDTO } from "@/modules/orders/mappers";
import {
  createOrder,
  getNextQueuePosition,
  getOrderById,
  listOrders,
  reorderQueuedOrders,
  updateOrderStatus,
} from "@/modules/orders/repository";
import { OrderDTO, OrderStatus } from "@/modules/orders/types";

export async function createSongOrder(userId: string, songId: string): Promise<OrderDTO> {
  await connectToDatabase();
  const [user, song] = await Promise.all([UserModel.findById(userId), SongModel.findById(songId)]);
  if (!user) {
    throw new Error("User not found");
  }
  if (!song) {
    throw new Error("Song not found");
  }

  const queuePosition = await getNextQueuePosition();
  const order = await createOrder(userId, songId, queuePosition);
  const hydrated = await getOrderById(String(order._id));
  if (!hydrated) {
    throw new Error("Order not found after creation");
  }
  return toOrderDTO(hydrated.toObject());
}

export async function getOrders(status?: string): Promise<OrderDTO[]> {
  const orders = await listOrders(status);
  return orders.map(toOrderDTO);
}

export async function setOrderStatus(orderId: string, status: OrderStatus): Promise<OrderDTO | null> {
  const updated = await updateOrderStatus(orderId, status);
  return updated ? toOrderDTO(updated) : null;
}

export async function reorderQueue(orderedIds: string[]): Promise<void> {
  await reorderQueuedOrders(orderedIds);
}
