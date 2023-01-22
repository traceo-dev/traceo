import { FC, useRef, useState } from "react";
import { Comment } from "../../../../../types/comments";
import dateUtils from "../../../../../core/utils/date";
import ReactMarkdown from "react-markdown";
import { conditionClass, joinClasses } from "../../../../../core/utils/classes";
import api from "../../../../../core/lib/api";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../../types/store";
import { InputArea } from "core/ui-components/Input/InputArea";
import { Button } from "core/ui-components/Button";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { Typography } from "core/ui-components/Typography";
import { Card } from "core/ui-components/Card";
import { Account } from "types/accounts";
import { Space } from "core/ui-components/Space";
import { Avatar } from "core/ui-components/Avatar";

interface Props {
  account: Account;
  comment: Comment;
  incidentId: string;
}

export const CommentItem: FC<Props> = ({ account, comment, incidentId }) => {
  const { message, sender, createdAt, lastUpdateAt, removed } = comment;

  const [isEditMode, setEditMode] = useState<boolean>(false);

  const { application } = useSelector((state: StoreState) => state.application);
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

  const editable = account?.id === sender?.id && !isEditMode && !removed;

  const cardHeader = () => {
    return (
      <Space className="w-full py-0 justify-between">
        <Space className="w-full items-center">
          <Typography size="md" weight="semibold">
            {sender?.name}
          </Typography>
          <Typography size="xxs" className="text-primary">
            commented {dateUtils.fromNow(createdAt)}
          </Typography>
        </Space>
        {editable && (
          <div className="flex flex-row gap-5 items-center">
            <Typography
              onClick={() => edit()}
              size="xs"
              className="cursor-pointer hover:text-blue-500 transition duration-2 min-w-max"
            >
              Edit
            </Typography>
            <Typography
              onClick={() => remove()}
              size="xs"
              className="cursor-pointer hover:text-red-500 transition duration-2 min-w-max"
            >
              Remove
            </Typography>
          </div>
        )}
      </Space>
    );
  };

  return (
    <div className="flex flex-row items-start mb-5">
      <Avatar className="mr-3" alt={sender?.name} src={sender?.gravatar} size="md" />
      <Card
        title={cardHeader()}
        className="border border-solid border-[#303030] rounded mb-5"
        bodyClassName={joinClasses("bg-canvas", conditionClass(removed, "hidden"))}
      >
        {!isEditMode && (
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
        )}

        {isEditMode && (
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
    </div>
  );
};
