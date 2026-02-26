import { UserDTO } from "@/modules/users/types";

type UserLike = {
  _id?: unknown;
  name?: string;
  membershipType?: "Gold" | "Silver" | "Bronze" | "Guest";
  avatar?: string;
  role?: "customer" | "owner";
};

export function toUserDTO(user: UserLike): UserDTO {
  return {
    _id: String(user._id ?? ""),
    name: user.name ?? "Guest",
    membershipType: user.membershipType ?? "Guest",
    avatar: user.avatar ?? "",
    role: user.role ?? "customer",
  };
}
