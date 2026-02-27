export type OrderStatus = "queued" | "playing" | "completed";

export type OrderDTO = {
  _id: string;
  user: {
    _id: string;
    name: string;
    membershipType: string;
    avatar: string;
    role: string;
  };
  song: {
    _id: string;
    title: string;
    artist: string;
    coverImage: string;
    previewUrl?: string;
  };
  status: OrderStatus;
  queuePosition: number;
  createdAt: string;
  updatedAt: string;
};
