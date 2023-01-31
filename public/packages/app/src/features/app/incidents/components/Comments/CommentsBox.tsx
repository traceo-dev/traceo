import { ConditionalWrapper } from "../../../../../core/components/ConditionLayout";
import { CommentItem } from "./CommentItem";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { DataNotFound } from "../../../../../core/components/DataNotFound";
import { Space, List } from "@traceo/ui";
import { useEffect } from "react";
import { loadIncidentComments } from "../../state/actions";
import { useAppDispatch } from "../../../../../store";
import { useAccount } from "../../../../../core/hooks/useAccount";

export const CommentsBox = () => {
  const dispatch = useAppDispatch();
  const account = useAccount();

  const { incident, comments, hasCommentsFetched } = useSelector(
    (state: StoreState) => state.incident
  );

  useEffect(() => {
    dispatch(loadIncidentComments());
  }, []);

  return (
    <Space
      id="messagesBox"
      className="overflow-y-hidden p-5 gap-x-2 overflow-auto w-full flex flex-col"
      direction="vertical"
    >
      <ConditionalWrapper
        className="my-12"
        isLoading={!hasCommentsFetched}
        isEmpty={comments?.length === 0 && hasCommentsFetched}
        emptyView={<DataNotFound label="No comments yet" />}
      >
        <List
          dataSource={comments}
          renderItem={(item) => (
            <CommentItem account={account} comment={item} incidentId={incident.id} />
          )}
        />
      </ConditionalWrapper>
    </Space>
  );
};
