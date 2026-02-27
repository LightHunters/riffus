import { Model, Schema, model, models } from "mongoose";

export type MembershipType = "Gold" | "Silver" | "Bronze" | "Guest";
export type UserRole = "customer" | "owner";

export type UserDocument = {
  _id: string;
  name: string;
  membershipType: MembershipType;
  avatar: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    membershipType: {
      type: String,
      enum: ["Gold", "Silver", "Bronze", "Guest"],
      default: "Guest",
    },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["customer", "owner"],
      default: "customer",
      index: true,
    },
  },
  { timestamps: true },
);

export const UserModel: Model<UserDocument> =
  models.User || model<UserDocument>("User", UserSchema);
