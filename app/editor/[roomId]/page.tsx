import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AccessDenied, EditorWorkspaceView } from "@/components/editor";
import { checkProjectAccess } from "@/lib/project-access";
import {
  getProjectsByOwner,
  getProjectsSharedWithUser,
} from "@/lib/db/projects";
import { slugify } from "@/lib/utils";
import { Project } from "@/types/project";

interface EditorRoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { roomId } = await params;
  const { hasAccess, project } = await checkProjectAccess(roomId);

  if (!hasAccess || !project) {
    return <AccessDenied />;
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  const [dbOwned, dbShared] = await Promise.all([
    getProjectsByOwner(userId),
    getProjectsSharedWithUser(userEmail),
  ]);

  const ownedProjects: Project[] = dbOwned.map((p) => ({
    id: p.id,
    name: p.name,
    slug: slugify(p.name),
    isOwner: true,
    updatedAt: new Date(p.updatedAt).toLocaleDateString(),
    createdAt: new Date(p.createdAt).toLocaleDateString(),
  }));

  const sharedProjects: Project[] = dbShared.map((p) => ({
    id: p.id,
    name: p.name,
    slug: slugify(p.name),
    isOwner: false,
    updatedAt: new Date(p.updatedAt).toLocaleDateString(),
    createdAt: new Date(p.createdAt).toLocaleDateString(),
  }));

  const currentProject: Project = {
    id: project.id,
    name: project.name,
    slug: slugify(project.name),
    isOwner: project.ownerId === userId,
    updatedAt: new Date(project.updatedAt).toLocaleDateString(),
    createdAt: new Date(project.createdAt).toLocaleDateString(),
  };

  return (
    <EditorWorkspaceView
      project={currentProject}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      roomId={roomId}
    />
  );
}
