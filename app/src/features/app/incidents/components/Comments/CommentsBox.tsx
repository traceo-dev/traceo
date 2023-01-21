import { ConditionalWrapper } from "../../../../../core/components/ConditionLayout";
import { CommentItem } from "./CommentItem";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../../types/store";
import { DataNotFound } from "../../../../../core/components/DataNotFound";
import { Space } from "core/ui-components/Space";
import { useEffect } from "react";
import { loadIncidentComments } from "../../state/actions";
import { dispatch } from "store/store";
import { List } from "core/ui-components/List";

export const CommentsBox = () => {
  const { account } = useSelector((state: StoreState) => state.account);
  const { incident, comments, hasCommentsFetched } = useSelector(
    (state: StoreState) => state.incident
  );

  useEffect(() => {
    dispatch(loadIncidentComments());
  }, []);

  return (
    <>
      <Space id="messagesBox" className="messagesBox" direction="vertical">
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
      <style>{`
        .messagesBox {
          overflow-y: hidden !important;
          padding: 10px;
          row-gap: 2px !important;
          overflow: auto;
          display: flex;
          flex-direction: column-reverse;
          width: 100%;
        }
      `}</style>
    </>
  );
};
