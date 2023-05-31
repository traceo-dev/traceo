import { useProject } from "../../../../../core/hooks/useProject";
import api from "../../../../../core/lib/api";
import dateUtils from "../../../../../core/utils/date";
import { EllipsisOutlined } from "@ant-design/icons";
import { IComment, IUser } from "@traceo/types";
import {
  InputArea,
  Button,
  ButtonContainer,
  Typography,
  Card,
  Space,
  Avatar,
  Popover
} from "@traceo/ui";
import { FC, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  user: IUser;
  comment: IComment;
}

export const CommentItem: FC<Props> = ({ user, comment }) => {
  const { message, sender, createdAt, lastUpdateAt, removed } = comment;

  const [isEditMode, setEditMode] = useState<boolean>(false);

  const { project } = useProject();
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

  const sendEdit = async () =>
    await api.comment.update(comment.id, textAreaRef.current.value, project.id).then(() => {
      setEditMode(false);
    });

  const remove = async () => await api.comment.remove(comment.id, project.id);

  const editOptions = () => {
    const options = [
      {
        label: "Edit",
        onClick: () => edit()
      },
      {
        label: "Remove",
        onClick: () => remove()
      }
    ];
    return (
      <ul className="list-none p-2">
        {options.map((opt, index) => (
          <li
            key={index}
            onClick={opt.onClick}
            className="mt-1 px-2 text-[14px] py-1 hover:bg-secondary rounded cursor-pointer"
          >
            {opt.label}
          </li>
        ))}
      </ul>
    );
  };

  const renderCommentHeader = () => {
    return (
      <Space className="w-full py-0 justify-between">
        <Space>
          <Avatar className="mr-1 w-7 h-7" alt={sender?.name} src={sender?.gravatar} size="md" />
          <div className="flex flex-col w-full ml-2 text-primary">
            <span className="font-semibold text-sm self-start">{sender?.name}</span>
            <span className="font-normal text-2xs">commented {dateUtils.fromNow(createdAt)}</span>
          </div>
        </Space>

        {user?.id === sender?.id && !isEditMode && !removed && (
          <Popover showArrow={false} placement="left" content={editOptions()}>
            <EllipsisOutlined className="p-2 hover:bg-secondary rounded-full cursor-pointer" />
          </Popover>
        )}
      </Space>
    );
  };

  return (
    <div className="flex flex-row items-start mb-2">
      <Card
        title={renderCommentHeader()}
        className="border border-solid border-[#303030] rounded mb-5"
        bodyClassName="bg-canvas"
      >
        {!isEditMode && (
          <Space direction="vertical" className="w-full text-primary">
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
            <ButtonContainer justify="end">
              <Button onClick={sendEdit}>Edit</Button>
              <Button variant="danger" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </ButtonContainer>
          </Space>
        )}
      </Card>
    </div>
  );
};
