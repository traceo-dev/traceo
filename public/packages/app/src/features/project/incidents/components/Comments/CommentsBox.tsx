import { ConditionalWrapper } from "../../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../../core/components/DataNotFound";
import { useUser } from "../../../../../core/hooks/useUser";
import { CommentItem } from "./CommentItem";
import { StoreState } from "@store/types";
import { Space, List } from "@traceo/ui";
import { useSelector } from "react-redux";

export const CommentsBox = () => {
  const user = useUser();
  const { comments, isLoading } = useSelector((state: StoreState) => state.comments);

  return (
    <Space
      id="messagesBox"
      className="overflow-y-hidden gap-x-2 overflow-auto w-full flex flex-col"
      direction="vertical"
    >
      <ConditionalWrapper
        className="my-12"
        isLoading={isLoading}
        isEmpty={comments?.length === 0 && !isLoading}
        emptyView={<DataNotFound label="No comments yet" />}
      >
        <List
          dataSource={comments}
          renderItem={(item) => <CommentItem user={user} comment={item} />}
        />
      </ConditionalWrapper>
    </Space>
  );
};
