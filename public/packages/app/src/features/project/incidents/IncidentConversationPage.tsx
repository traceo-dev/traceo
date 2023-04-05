import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { useAppDispatch } from "../../../store";
import { CommentInput } from "./components/Comments/CommentInput";
import { CommentsBox } from "./components/Comments/CommentsBox";
import IncidentPageWrapper from "./components/IncidentPageWrapper";
import { AlertOutlined } from "@ant-design/icons";
import { StoreState } from "../../../store/types";
import { Typography, Space, Card, Divider } from "@traceo/ui";
import { useSelector } from "react-redux";
import { useLive } from "../../../core/hooks/useLive";
import { IComment } from "@traceo/types";
import { setIncidentComments } from "./state/slices/comments.slice";

export const IncidentConversationPage = () => {
  const live = useLive();
  const dispatch = useAppDispatch();
  const { incident, isLoading: isLoadingIncident } = useSelector(
    (state: StoreState) => state.incident
  );
  const { comments } = useSelector((state: StoreState) => state.comments);

  live.listen("new_comment", (comment: IComment) => {
    dispatch(setIncidentComments([...comments, comment]));
  });

  live.listen("update_comment", (comment: IComment) => {
    const commentsUpdate = [...comments];
    const index = commentsUpdate.findIndex((f) => f.id === comment.id);
    commentsUpdate[index] = comment;
    if (index !== -1) {
      dispatch(setIncidentComments(commentsUpdate));
    }
  });

  live.listen("remove_comment", (comment: IComment) => {
    const commentsUpdate = [...comments];
    const index = commentsUpdate.findIndex((f) => f.id === comment.id);
    commentsUpdate.splice(index, 1);
    if (index !== -1) {
      dispatch(setIncidentComments(commentsUpdate));
    }
  });

  return (
    <IncidentPageWrapper>
      <ConditionalWrapper isLoading={isLoadingIncident}>
        <Card className="w-full p-1 rounded-md mb-5 bg-primary">
          <Space className="w-full">
            <AlertOutlined className="text-3xl pr-2 text-red-700" />
            <Space className="w-full gap-0" direction="vertical">
              <Typography size="xxl" weight="normal">
                {incident?.name}
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
