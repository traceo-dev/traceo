import { Timeline } from "antd";
import { ConditionalWrapper } from "../../../../../core/components/ConditionLayout";
import { CommentItem } from "./CommentItem";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../../types/store";
import { DataNotFound } from "../../../../../core/components/DataNotFound";
import { Space } from "core/ui-components/Space";
import { Avatar } from "core/ui-components/Avatar";
import { useEffect } from "react";
import { loadIncidentComments } from "../../state/actions";
import { dispatch } from "store/store";

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
          <Timeline className="h-full pl-5 pt-5">
            {comments?.map((comment, index) => (
              <Timeline.Item
                className="pb-0 mb-5 pl-5"
                key={index}
                dot={
                  <Avatar
                    shape="circle"
                    alt={comment.sender.name}
                    src={comment.sender?.gravatar}
                  />
                }
              >
                <CommentItem
                  account={account}
                  comment={comment}
                  incidentId={incident.id}
                />
              </Timeline.Item>
            ))}
          </Timeline>
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
