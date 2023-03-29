import api from "../api";
import { ProjectMember, MemberRole } from "@traceo/types";

const onUpdateRole = async (
  member: ProjectMember,
  role: MemberRole,
  postExecute: () => void
) => {
  await api
    .patch("/api/member", {
      memberId: member.id,
      role
    })
    .finally(() => postExecute());
};

const onRemoveFromProject = async (member: ProjectMember, postExecute: () => void) => {
  await api
    .delete("/api/member", {
      id: member.id
    })
    .finally(() => postExecute());
};

export const membersAction = { onUpdateRole, onRemoveFromProject };
