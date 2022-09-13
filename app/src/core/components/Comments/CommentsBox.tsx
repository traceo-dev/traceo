import { Space, Timeline } from "antd";
import { Avatar } from "../Avatar";
import { ConditionLayout } from "../ConditionLayout";
import { EmptyIncidentCommentsList } from "../EmptyViews/EmptyIncidentCommentsList";
import { CommentItem } from "./CommentItem";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";

export const CommentsBox = () => {
  const { incident, comments, hasCommentsFetched } = useSelector(
    (state: StoreState) => state.incident
  );
  return (
    <>
      <Space id="messagesBox" className="messagesBox" direction="vertical">
        <ConditionLayout
          className="my-12"
          isLoading={!hasCommentsFetched}
          isEmpty={comments?.length === 0 && hasCommentsFetched}
          emptyView={<EmptyIncidentCommentsList />}
        >
          <Timeline>
            {comments?.map((comment, index) => (
              <Timeline.Item
                className="pb-0"
                key={index}
                dot={
                  <Avatar
                    size="default"
                    shape="circle"
                    name={comment.sender.name}
                    url={comment.sender?.logo}
                  />
                }
              >
                <CommentItem comment={comment} incidentId={incident.id} />
              </Timeline.Item>
            ))}
          </Timeline>
        </ConditionLayout>
      </Space>
      <style>{`
        .messagesBox {
          overflow-y: scroll;
          padding: 10px;
          row-gap: 2px !important;
          overflow: auto;
          display: flex;
          flex-direction: column-reverse;
          width: "100%";
        }
      `}</style>
    </>
  );
};
