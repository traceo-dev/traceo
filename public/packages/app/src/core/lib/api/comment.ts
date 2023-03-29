import api from "../api";

const send = async (incidentId: string, projectId: string, message: string) => {
  await api.post("/api/comments/send", {
    incidentId,
    projectId,
    message
  });
};

const update = async (commentId: string, message: string, projectId: string) => {
  await api.patch(`/api/comments/update/${commentId}`, {
    message: message,
    projectId
  });
};

const remove = async (commentId: string, projectId: string) => {
  await api.delete(`/api/comments/remove/${commentId}`, {
    projectId
  });
};

export const commentAction = {
  send,
  update,
  remove
};
