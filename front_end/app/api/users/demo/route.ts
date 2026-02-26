import { fail, ok } from "@/lib/http";
import { getOrCreateDemoUser } from "@/modules/users/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedRole = searchParams.get("role");
    const role = requestedRole === "owner" ? "owner" : "customer";
    const user = await getOrCreateDemoUser(role);
    return ok(user);
  } catch (error) {
    return fail("Failed to fetch demo user", 500, String(error));
  }
}
