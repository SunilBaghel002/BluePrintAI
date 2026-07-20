export interface Project {
  id: string;
  name: string;
  slug: string;
  isOwner: boolean;
  updatedAt: string;
  createdAt?: string;
}

export type ProjectDialogType = "create" | "rename" | "delete" | null;
