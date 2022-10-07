import { Space, Typography, Card, Form, Input, Popover, List, Tag, Button } from "antd";
import { FC, useRef, useState } from "react";
import { Comment } from "../../../../../types/comments";
import dateUtils from "../../../../../core/utils/date";
import ReactMarkdown from "react-markdown";
import { EllipsisOutlined } from "@ant-design/icons";
import { conditionClass, joinClasses } from "../../../../../core/utils/classes";
import { TextAreaRef } from "antd/lib/input/TextArea";
import { MarkdownHeader } from "./MarkdownHeader";
import api from "../../../../../core/lib/api";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../../types/store";

interface Props {
  comment: Comment;
  incidentId: string;
}

export const CommentItem: FC<Props> = ({ comment, incidentId }) => {
  const { message, sender, createdAt, lastUpdateAt, removed } = comment;

  const [isEditMode, setEditMode] = useState<boolean>(false);

  const { application } = useSelector((state: StoreState) => state.application);
  const { account } = useSelector((state: StoreState) => state.account);
  const textAreaRef = useRef<TextAreaRef>(null);
  const [form] = Form.useForm();

  const shortcut = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      sendEdit();
    }
  };

  const edit = () => {
    form.setFieldsValue({
      comment: comment.message
    });
    setEditMode(true);

    setTimeout(() => {
      textAreaRef.current.focus();
    }, 10);
  };

  const sendEdit = async () => {
    const message = form.getFieldValue("comment");
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
              <Typography className="font-semibold text-xs">{sender?.name}</Typography>
              <Typography.Text className="text-primary text-xs font-normal">
                commented {dateUtils.formatDateTime(createdAt)}
              </Typography.Text>
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
                <Typography className="text-2xs text-gray-400 font-normal">
                  edited {dateUtils.fromNow(lastUpdateAt)}
                </Typography>
              )}
            </Space>
          </Space>
        ) : (
          <Space direction="vertical" className="w-full">
            <Space
              direction="vertical"
              className="w-full justify-end bg-secondary rounded-lg"
            >
              <MarkdownHeader className="pb-0" form={form} />
            </Space>
            <Form form={form}>
              <Form.Item name="comment" className="w-full mb-2">
                <Input.TextArea
                  id="commentInput"
                  placeholder="Leave a comment"
                  autoSize={{ minRows: 6, maxRows: 12 }}
                  className="w-full rounded-md p-3"
                  ref={textAreaRef}
                  onKeyDown={(val) => shortcut(val)}
                />
              </Form.Item>
            </Form>
            <Space>
              <Button type="primary" onClick={() => sendEdit()}>
                Edit
              </Button>
              <Button ghost onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </Space>
          </Space>
        )}
      </Card>
    </>
  );
};
