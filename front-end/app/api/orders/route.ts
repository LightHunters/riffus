import { fail, ok } from "@/lib/http";
import { createSongOrder, getOrders } from "@/modules/orders/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const data = await getOrders(status);
    return ok(data);
  } catch (error) {
    return fail("Failed to fetch orders", 500, String(error));
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { userId?: string; songId?: string };
    if (!body.userId || !body.songId) {
      return fail("userId and songId are required", 400);
    }

    const data = await createSongOrder(body.userId, body.songId);
    return ok(data, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    const status = message.includes("not found") ? 404 : 500;
    return fail(message, status);
  }
}
