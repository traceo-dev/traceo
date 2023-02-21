import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { SocketContext } from "../../../core/contexts/SocketContextProvider";
import { useAppDispatch } from "../../../store";
import { CommentInput } from "./components/Comments/CommentInput";
import { CommentsBox } from "./components/Comments/CommentsBox";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { loadIncidentComments } from "./state/actions";
import { AlertOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import { Typography, Space, Card, Divider } from "@traceo/ui";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";

export const IncidentConversationPage = () => {
  const { socket } = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const { incident, hasFetched } = useSelector((state: StoreState) => state.incident);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = () => {
    dispatch(loadIncidentComments());
  };

  useEffect(() => {
    socket.emit("join_room", incident?.id);
  }, []);

  socket.off("new_comment").on("new_comment", () => fetchComments());
  socket.off("update_comment").on("update_comment", () => fetchComments());

  return (
    <IncidentPageWrapper>
      <ConditionalWrapper isLoading={!hasFetched}>
        <Card className="w-full p-1 rounded-md mb-5 bg-primary">
          <Space className="w-full">
            <AlertOutlined className="text-3xl pr-2 text-red-700" />
            <Space className="w-full gap-0" direction="vertical">
              <Typography size="xxl" weight="normal">
                {incident?.type}
              </Typography>
              <Typography weight="normal">{incident?.message}</Typography>
            </Space>
          </Space>
        </Card>
        <CommentsBox />
        <Divider className="mb-5" />
        <CommentInput />
      </ConditionalWrapper>
    </IncidentPageWrapper>
  );
};

export default IncidentConversationPage;
