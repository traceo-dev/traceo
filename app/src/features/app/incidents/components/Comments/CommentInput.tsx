import { FileMarkdownFilled } from "@ant-design/icons";
import { Card, Col, Row, Space, Tabs, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import api from "../../../../../core/lib/api";
import { loadIncidentComments } from "../../state/actions";
import { dispatch } from "../../../../../store/store";
import { StoreState } from "../../../../../types/store";
import { Avatar } from "../../../../../core/components/Avatar";
import { InputArea } from "core/ui-components/Input/InputArea";
import { Button } from "core/ui-components/Button/Button";

const { TabPane } = Tabs;

export const CommentInput = () => {
  const { account } = useSelector((state: StoreState) => state.account);
  const { application } = useSelector((state: StoreState) => state.application);
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
    <Card className="w-full p-1 bg-primary mb-5">
      <Row gutter={24} className="w-full">
        <Col span={1}>
          <Avatar
            name={account?.name}
            url={account?.gravatar}
            shape="circle"
            size="large"
          />
        </Col>
        <Col span={23}>
          <Tabs
            type="card"
            className="customized-tab customized-tab-active customized-tab-header customized-tab-body"
          >
            <TabPane key={1} tab="Write">
              <InputArea
                placeholder="Leave a comment"
                onKeyDown={(val) => shortcut(val)}
                onChange={(val) => setComment(val.currentTarget.value)}
                ref={textAreaRef}
                rows={6}
              />
            </TabPane>
            <TabPane key={2} tab="Preview">
              <Space className="w-full p-3 pb-34 mb-2 bg-secondary">
                <ReactMarkdown className="pb-24">{comment}</ReactMarkdown>
              </Space>
            </TabPane>
          </Tabs>

          <Space className="w-full justify-between pt-0 mt-0">
            <Typography.Link
              target="_blank"
              href="https://www.markdownguide.org/basic-syntax/"
              className="text-primary text-xs"
            >
              <FileMarkdownFilled className="pr-1" />
              Markdown supported
            </Typography.Link>
            <Button
              className="mt-5"
              disabled={sendAvailable}
              onClick={() => sendMessage()}
            >
              Comment
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
