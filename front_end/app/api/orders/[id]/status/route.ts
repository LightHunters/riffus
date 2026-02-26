import { fail, ok } from "@/lib/http";
import { setOrderStatus } from "@/modules/orders/service";
import { OrderStatus } from "@/modules/orders/types";

export const runtime = "nodejs";

function isOrderStatus(value: string): value is OrderStatus {
  return value === "queued" || value === "playing" || value === "completed";
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const body = (await request.json()) as { status?: string };
    if (!body.status || !isOrderStatus(body.status)) {
      return fail("status must be one of queued, playing, completed", 400);
    }

    const { id } = await context.params;
    const data = await setOrderStatus(id, body.status);
    if (!data) {
      return fail("Order not found", 404);
    }
    return ok(data);
  } catch (error) {
    return fail("Failed to update order status", 500, String(error));
  }
}
