import api from "../api";
import { ApplicationMember, MemberRole } from "@traceo/types";

const onUpdateRole = async (
  member: ApplicationMember,
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

const onRemoveFromApp = async (member: ApplicationMember, postExecute: () => void) => {
  await api
    .delete("/api/member", {
      id: member.id
    })
    .finally(() => postExecute());
};

export const membersAction = { onUpdateRole, onRemoveFromApp };
