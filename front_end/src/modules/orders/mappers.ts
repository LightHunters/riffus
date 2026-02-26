import { OrderDTO } from "@/modules/orders/types";

type OrderLike = {
  _id?: unknown;
  user?: {
    _id?: unknown;
    name?: string;
    membershipType?: string;
    avatar?: string;
    role?: string;
  };
  song?: {
    _id?: unknown;
    title?: string;
    artist?: string;
    coverImage?: string;
    previewUrl?: string;
  };
  status?: "queued" | "playing" | "completed";
  queuePosition?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export function toOrderDTO(order: OrderLike): OrderDTO {
  return {
    _id: String(order._id ?? ""),
    user: {
      _id: String(order.user?._id ?? ""),
      name: order.user?.name ?? "Guest",
      membershipType: order.user?.membershipType ?? "Guest",
      avatar: order.user?.avatar ?? "",
      role: order.user?.role ?? "customer",
    },
    song: {
      _id: String(order.song?._id ?? ""),
      title: order.song?.title ?? "",
      artist: order.song?.artist ?? "",
      coverImage: order.song?.coverImage ?? "",
      previewUrl: order.song?.previewUrl ?? "",
    },
    status: order.status ?? "queued",
    queuePosition: order.queuePosition ?? 0,
    createdAt: order.createdAt
      ? new Date(order.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: order.updatedAt
      ? new Date(order.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}
