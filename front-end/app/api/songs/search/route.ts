import { fail, ok } from "@/lib/http";
import { searchSongs } from "@/modules/songs/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    const limit = Number(searchParams.get("limit") ?? "25");

    if (!q) {
      return fail("Query parameter q is required", 400);
    }

    const data = await searchSongs(q, Number.isNaN(limit) ? 25 : limit);
    return ok(data);
  } catch (error) {
    return fail("Failed to search songs", 500, String(error));
  }
}
