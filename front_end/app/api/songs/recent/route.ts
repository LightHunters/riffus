import { fail, ok } from "@/lib/http";
import { getRecentSongs } from "@/modules/songs/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "10");
    const data = await getRecentSongs(Number.isNaN(limit) ? 10 : limit);
    return ok(data);
  } catch (error) {
    return fail("Failed to fetch recent songs", 500, String(error));
  }
}
