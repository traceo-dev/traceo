import { AlertOutlined } from "@ant-design/icons";
import { Card, Space, Typography } from "antd";
import { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CommentInput } from "src/core/components/Comments/CommentInput";
import { CommentsBox } from "src/core/components/Comments/CommentsBox";
import { ConditionLayout } from "src/core/components/ConditionLayout";
import { SocketContext } from "src/core/hooks/SocketContextProvider";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";
import { Comment } from "src/types/comments";
import AppIncidentNavigationPage from "./components/AppIncidentNavigationPage";
import { loadIncidentComments } from "./state/actions";

export const AppIncidentConversationPage = () => {
  const { socket } = useContext(SocketContext);
  const [render, rerender] = useState<boolean>(false);
  const { incident, comments, hasFetched } = useSelector(
    (state: StoreState) => state.incident
  );

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = () => {
    dispatch(loadIncidentComments());
  };

  useEffect(() => {
    socket.emit("join_room", incident?.id);
  }, []);

  socket.off("new_comment").on("new_comment", (comment: Comment) => {
    comments.splice(0, 0, comment);
    rerender(!render);
  });

  socket.off("update_comment").on("update_comment", () => {
    fetchComments();
  });

  return (
    <>
      <AppIncidentNavigationPage>
        <ConditionLayout isLoading={!hasFetched}>
          <Card className="w-full p-1 rounded-md mb-5 bg-primary">
            <Space className="w-full">
              <AlertOutlined className="text-3xl pr-2 text-red-700" />
              <Space className="w-full gap-0" direction="vertical">
                <Typography className="text-xl font-semibold">
                  {incident?.type}
                </Typography>
                <Typography.Text>{incident?.message}</Typography.Text>
              </Space>
            </Space>
          </Card>
          <CommentsBox />
          <CommentInput />
        </ConditionLayout>
      </AppIncidentNavigationPage>
    </>
  );
};

export default AppIncidentConversationPage;
