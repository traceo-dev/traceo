import { FileMarkdownFilled } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../../../core/lib/api";
import { loadIncidentComments } from "../../state/actions";
import { useAppDispatch } from "../../../../../store";
import { StoreState } from "@store/types";
import { InputArea, Button, Link, Card, Space, Avatar } from "@traceo/ui";
import { useAccount } from "../../../../../core/hooks/useAccount";
import { useApplication } from "../../../../../core/hooks/useApplication";

export const CommentInput = () => {
  const dispatch = useAppDispatch();
  const account = useAccount();
  const { application } = useApplication();
  const { incident } = useSelector((state: StoreState) => state.incident);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState<string>(null);
  const [sendAvailable, setSendAvailable] = useState<boolean>(false);

  useEffect(() => {
    setSendAvailable(comment?.length === 0);
  }, [comment]);

  const sendMessage = async () => {
    await api.comment.send(incident.id, application.id, comment);

    setComment(null);
    textAreaRef.current.value = null;
    setTimeout(() => {
      textAreaRef.current.focus();
    }, 10);

    fetchComments();
  };

  const fetchComments = () => {
    dispatch(loadIncidentComments());
  };

  const shortcut = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      sendMessage();
    }
  };

  return (
    <Card className="w-full mb-5">
      <div className="w-full flex flex-row">
        <Avatar alt={account?.name} src={account?.gravatar} size="md" />
        <div className="w-full">
          <InputArea
            className="ml-2"
            placeholder="Leave a comment"
            onKeyDown={(val) => shortcut(val)}
            onChange={(val) => setComment(val.currentTarget.value)}
            ref={textAreaRef}
            rows={6}
          />

          <Space className="w-full justify-between pt-0 mt-0">
            <Link
              className="cursor-pointer"
              target="_blank"
              href="https://www.markdownguide.org/basic-syntax/"
            >
              <span className="text-xs">
                <FileMarkdownFilled className="pr-1" />
                Markdown supported
              </span>
            </Link>

            <Button
              className="mt-5"
              disabled={sendAvailable}
              onClick={() => sendMessage()}
            >
              Comment
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};