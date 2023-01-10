import { AlertOutlined } from "@ant-design/icons";
import { Card, Space } from "antd";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { CommentInput } from "./components/Comments/CommentInput";
import { CommentsBox } from "./components/Comments/CommentsBox";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { SocketContext } from "../../../core/hooks/SocketContextProvider";
import { dispatch } from "../../../store/store";
import { StoreState } from "../../../types/store";
import AppIncidentNavigationPage from "./components/AppIncidentNavigationPage";
import { loadIncidentComments } from "./state/actions";
import { Typography } from "core/ui-components/Typography/Typography";

export const AppIncidentConversationPage = () => {
  const { socket } = useContext(SocketContext);
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
    <>
      <AppIncidentNavigationPage>
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
          <CommentInput />
        </ConditionalWrapper>
      </AppIncidentNavigationPage>
    </>
  );
};

export default AppIncidentConversationPage;
