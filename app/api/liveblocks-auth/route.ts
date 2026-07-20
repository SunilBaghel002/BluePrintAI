import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { checkProjectAccess } from "@/lib/project-access";
import { liveblocks, getUserColor } from "@/lib/liveblocks";

const liveblocksAuthSchema = z.object({
  room: z.string().min(1, "Room ID is required"),
});

export async function POST(request: Request) {
  let bodyJson: unknown;
  try {
    bodyJson = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parseResult = liveblocksAuthSchema.safeParse(bodyJson);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { room } = parseResult.data;

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const access = await checkProjectAccess(room);
  if (!access.hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await liveblocks.getOrCreateRoom(room, {
      defaultAccesses: [],
    });
  } catch (error) {
    console.error("Liveblocks getOrCreateRoom error:", error);
  }

  const name =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
      : user.primaryEmailAddress?.emailAddress ?? "Anonymous";

  const avatar = user.imageUrl ?? "";
  const color = getUserColor(user.id);

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name,
      avatar,
      color,
    },
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
