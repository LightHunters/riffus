import { connectToDatabase } from "@/lib/db";
import { OrderModel } from "@/models/Order";

export async function getNextQueuePosition() {
  await connectToDatabase();
  const order = await OrderModel.findOne({ status: "queued" })
    .sort({ queuePosition: -1 })
    .select({ queuePosition: 1 })
    .lean();

  return (order?.queuePosition ?? 0) + 1;
}

export async function createOrder(userId: string, songId: string, queuePosition: number) {
  await connectToDatabase();
  return OrderModel.create({
    user: userId,
    song: songId,
    status: "queued",
    queuePosition,
  });
}

export async function listOrders(status?: string): Promise<any[]> {
  await connectToDatabase();
  const filter =
    status && ["queued", "playing", "completed"].includes(status) ? { status } : {};

  return (await OrderModel.find(filter)
    .sort({ queuePosition: 1, createdAt: 1 })
    .populate("song")
    .populate("user")
    .lean()) as any[];
}

export async function getOrderById(orderId: string): Promise<any> {
  await connectToDatabase();
  return OrderModel.findById(orderId).populate("song").populate("user");
}

export async function updateOrderStatus(orderId: string, status: "queued" | "playing" | "completed") {
  await connectToDatabase();
  return (await OrderModel.findByIdAndUpdate(orderId, { $set: { status } }, { new: true })
    .populate("song")
    .populate("user")
    .lean()) as any;
}

export async function reorderQueuedOrders(orderedIds: string[]) {
  await connectToDatabase();
  const updates = orderedIds.map((id, index) =>
    OrderModel.updateOne(
      { _id: id, status: "queued" },
      { $set: { queuePosition: index + 1 } },
    ),
  );

  await Promise.all(updates);
}
