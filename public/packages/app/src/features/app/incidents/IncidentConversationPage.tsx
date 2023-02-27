import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useAppDispatch } from "../../../store";
import { CommentInput } from "./components/Comments/CommentInput";
import { CommentsBox } from "./components/Comments/CommentsBox";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { AlertOutlined } from "@ant-design/icons";
import { StoreState } from "@store/types";
import { Typography, Space, Card, Divider } from "@traceo/ui";
import { useSelector } from "react-redux";
import { useLive } from "../../../core/hooks/useLive";
import { incidentCommentsLoaded } from "./state/reducers";
import { IComment } from "@traceo/types";

export const IncidentConversationPage = () => {
  const live = useLive();
  const dispatch = useAppDispatch();
  const { comments, incident, hasFetched } = useSelector((state: StoreState) => state.incident);

  live.listen("new_comment", (comment: IComment) => {
    dispatch(incidentCommentsLoaded([...comments, comment]));
  });

  live.listen("update_comment", (comment: IComment) => {
    const commentsUpdate = [...comments];
    const index = commentsUpdate.findIndex((f) => f.id === comment.id);
    commentsUpdate[index] = comment;
    if (index !== -1) {
      dispatch(incidentCommentsLoaded(commentsUpdate));
    }
  });

  live.listen("remove_comment", (comment: IComment) => {
    const commentsUpdate = [...comments];
    const index = commentsUpdate.findIndex((f) => f.id === comment.id);
    commentsUpdate.splice(index, 1);
    if (index !== -1) {
      dispatch(incidentCommentsLoaded(commentsUpdate));
    }
  });

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
