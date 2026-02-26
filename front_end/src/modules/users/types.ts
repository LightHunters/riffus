export type UserDTO = {
  _id: string;
  name: string;
  membershipType: "Gold" | "Silver" | "Bronze" | "Guest";
  avatar: string;
  role: "customer" | "owner";
};
