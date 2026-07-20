import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createProject, getProjectsByOwner } from "@/lib/db/projects";

const createProjectSchema = z.object({
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await getProjectsByOwner(userId);
    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let json: unknown = {};
    try {
      json = await request.json();
    } catch {
      // Empty body is acceptable; defaults to Untitled Project
    }

    const parsed = createProjectSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const project = await createProject({
      ownerId: userId,
      name: parsed.data.name,
      description: parsed.data.description,
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
