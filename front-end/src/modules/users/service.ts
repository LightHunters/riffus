import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";
import { toUserDTO } from "@/modules/users/mappers";
import { UserDTO } from "@/modules/users/types";

export async function getOrCreateDemoUser(role: "customer" | "owner" = "customer"): Promise<UserDTO> {
  const name = role === "owner" ? "Cafe Owner" : "Guest";
  const fallbackUser: UserDTO = {
    _id: role === "owner" ? "demo-owner" : "demo-customer",
    name,
    membershipType: role === "owner" ? "Gold" : "Guest",
    avatar:
      role === "owner"
        ? "https://i.pravatar.cc/120?img=12"
        : "https://i.pravatar.cc/120?img=5",
    role,
  };

  try {
    await connectToDatabase();
    const existing = await UserModel.findOne({ name, role }).lean();
    if (existing) {
      return toUserDTO(existing);
    }

    const created = await UserModel.create({
      name,
      membershipType: role === "owner" ? "Gold" : "Guest",
      avatar: fallbackUser.avatar,
      role,
    });

    return toUserDTO(created.toObject());
  } catch {
    return fallbackUser;
  }
}
