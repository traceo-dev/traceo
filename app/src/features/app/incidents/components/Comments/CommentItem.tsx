import { Space, Card, Popover, List, Tag } from "antd";
import { FC, useRef, useState } from "react";
import { Comment } from "../../../../../types/comments";
import dateUtils from "../../../../../core/utils/date";
import ReactMarkdown from "react-markdown";
import { EllipsisOutlined } from "@ant-design/icons";
import { conditionClass, joinClasses } from "../../../../../core/utils/classes";
import api from "../../../../../core/lib/api";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../../types/store";
import { InputArea } from "core/ui-components/Input/InputArea";
import { Button } from "core/ui-components/Button/Button";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { Typography } from "core/ui-components/Typography/Typography";

interface Props {
  comment: Comment;
  incidentId: string;
}

export const CommentItem: FC<Props> = ({ comment, incidentId }) => {
  const { message, sender, createdAt, lastUpdateAt, removed } = comment;

  const [isEditMode, setEditMode] = useState<boolean>(false);

  const { application } = useSelector((state: StoreState) => state.application);
  const { account } = useSelector((state: StoreState) => state.account);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const shortcut = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      sendEdit();
    }
  };

  const edit = () => {
    setEditMode(true);
    setTimeout(() => {
      textAreaRef.current.focus();
    }, 10);
  };

  const sendEdit = async () => {
    const message = textAreaRef.current.value;
    await api.comment.update(comment.id, message, application.id, incidentId);

    setEditMode(false);
  };

  const remove = async () => {
    await api.comment.remove(comment.id, application.id, incidentId);
  };

  const popoverContent = () => (
    <List>
      <List.Item
        className="py-1 hover:text-gray-400 cursor-pointer"
        onClick={() => edit()}
      >
        Edit
      </List.Item>
      <List.Item
        className="py-1 hover:text-red-500 cursor-pointer"
        onClick={() => remove()}
      >
        Remove
      </List.Item>
    </List>
  );

  const isEdit = account?.id === sender?.id && !isEditMode && !removed;

  return (
    <>
      <Card
        title={
          <Space className="w-full py-0 justify-between">
            <Space className="w-full">
              <Typography size="xs" weight="semibold">
                {sender?.name}
              </Typography>
              <Typography size="xs" className="text-primary">
                commented {dateUtils.fromNow(createdAt)}
              </Typography>
              {removed && <Tag color="cyan">Removed</Tag>}
            </Space>
            {isEdit && (
              <Popover placement="bottom" content={popoverContent}>
                <EllipsisOutlined className="cursor-pointer" />
              </Popover>
            )}
          </Space>
        }
        className={joinClasses(
          "whitespace-pre whitespace-pre-line w-full rounded-md mt-5 comment-card-header bg-comment-body",
          conditionClass(
            dateUtils.isRecentComment(createdAt),
            "border-cyan-600 border-2"
          ),
          conditionClass(removed, "ant-card-body-none")
        )}
      >
        {!isEditMode ? (
          <Space direction="vertical" className="w-full">
            <ReactMarkdown>{message}</ReactMarkdown>
            <Space className="w-full justify-end">
              {lastUpdateAt && !removed && (
                <Typography size="xxs" className="text-gray-400">
                  edited {dateUtils.fromNow(lastUpdateAt)}
                </Typography>
              )}
            </Space>
          </Space>
        ) : (
          <Space direction="vertical" className="w-full">
            <InputArea
              placeholder="Leave a comment"
              rows={6}
              defaultValue={comment?.message}
              ref={textAreaRef}
              onKeyDown={(val) => shortcut(val)}
            />
            <ButtonContainer justify="start">
              <Button onClick={sendEdit}>Edit</Button>
              <Button variant="ghost" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </ButtonContainer>
          </Space>
        )}
      </Card>
    </>
  );
};
