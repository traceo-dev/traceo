import { ApplicationMember, MemberRole } from "../../../types/application";
import api from ".";

const onUpdateRole = async (member: ApplicationMember, role: MemberRole, postExecute: () => void) => {
    await api
        .patch("/api/amr/application/member", {
            memberId: member.id,
            role
        })
        .finally(() => postExecute());
};

const onRemoveFromApp = async (member: ApplicationMember, postExecute: () => void) => {
    await api
        .delete("/api/amr/application/member", {
            id: member.id
        })
        .finally(() => postExecute());
};

export const membersAction = { onUpdateRole, onRemoveFromApp }