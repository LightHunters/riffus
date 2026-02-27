import { Model, Schema, model, models } from "mongoose";

export type OrderStatus = "queued" | "playing" | "completed";

export type OrderDocument = {
  _id: string;
  user: Schema.Types.ObjectId;
  song: Schema.Types.ObjectId;
  status: OrderStatus;
  queuePosition: number;
  createdAt: Date;
  updatedAt: Date;
};

const OrderSchema = new Schema<OrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    song: { type: Schema.Types.ObjectId, ref: "Song", required: true, index: true },
    status: {
      type: String,
      enum: ["queued", "playing", "completed"],
      default: "queued",
      index: true,
    },
    queuePosition: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

OrderSchema.index({ status: 1, queuePosition: 1, createdAt: 1 });

export const OrderModel: Model<OrderDocument> =
  models.Order || model<OrderDocument>("Order", OrderSchema);
