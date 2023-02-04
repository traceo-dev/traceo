import { store } from "../../../store/index";
import { loadIncidentComments } from "src/features/app/incidents/state/actions";
import api from "../api";

const send = async (incidentId: string, applicationId: string, message: string) => {
  await api.post("/api/comments/send", {
    incidentId,
    applicationId,
    message
  });
};

const update = async (
  commentId: string,
  message: string,
  applicationId: string,
  incidentId: string
) => {
  await api.patch(`/api/comments/update/${commentId}`, {
    message: message,
    applicationId,
    incidentId
  });
};

const remove = async (commentId: string, applicationId: string, incidentId: string) => {
  await api.delete(`/api/comments/remove/${commentId}`, {
    applicationId,
    incidentId
  }).then(() => {
    store.dispatch(loadIncidentComments());
  });
};

export const commentAction = {
  send,
  update,
  remove
};
