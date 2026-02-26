import { fail, ok } from "@/lib/http";
import { registerSongPlay } from "@/modules/songs/service";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const song = await registerSongPlay(id);
    if (!song) {
      return fail("Song not found", 404);
    }
    return ok(song);
  } catch (error) {
    return fail("Failed to update play count", 500, String(error));
  }
}
