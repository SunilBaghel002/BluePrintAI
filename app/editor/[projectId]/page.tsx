import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EditorHomeView } from "@/components/editor";
import {
  getProjectsByOwner,
  getProjectsSharedWithUser,
} from "@/lib/db/projects";
import { slugify } from "@/lib/utils";
import { Project } from "@/types/project";

interface EditorWorkspacePageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditorWorkspacePage({
  params,
}: EditorWorkspacePageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { projectId } = await params;
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

  return (
    <EditorHomeView
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      activeProjectId={projectId}
    />
  );
}
