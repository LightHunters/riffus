import { fail, ok } from "@/lib/http";
import { reorderQueue } from "@/modules/orders/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { orderedIds?: string[] };
    if (!Array.isArray(body.orderedIds) || body.orderedIds.length === 0) {
      return fail("orderedIds must be a non-empty array", 400);
    }

    await reorderQueue(body.orderedIds);
    return ok({ reordered: true });
  } catch (error) {
    return fail("Failed to reorder queue", 500, String(error));
  }
}
