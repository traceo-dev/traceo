import { FileMarkdownFilled } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Space, Tabs, Typography } from "antd";
import { TextAreaRef } from "antd/lib/input/TextArea";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import api from "src/core/lib/api";
import { loadIncidentComments } from "src/features/app/incidents/state/actions";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";
import { Avatar } from "../Avatar";
import { MarkdownHeader } from "./MarkdownHeader";

const { TabPane } = Tabs;

export const CommentInput = () => {
  const { account } = useSelector((state: StoreState) => state.account);
  const { application } = useSelector((state: StoreState) => state.application);
  const { incident } = useSelector((state: StoreState) => state.incident);
  const textAreaRef = useRef<TextAreaRef>(null);
  const [form] = Form.useForm();
  const [comment, setComment] = useState<string>(null);
  const [sendAvailable, setSendAvailable] = useState<boolean>(false);

  useEffect(() => {
    comment?.length > 0 ? setSendAvailable(false) : setSendAvailable(true);
  }, [comment]);

  const sendMessage = async () => {
    const comment = form.getFieldValue("typedComment");

    await api.comment.send(incident.id, application.id, comment);

    form.resetFields();
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
          <Avatar name={account?.name} shape="circle" size="large" />
        </Col>
        <Col span={23}>
          <Tabs
            type="card"
            className="customized-tab customized-tab-active customized-tab-header customized-tab-body"
            tabBarExtraContent={<MarkdownHeader form={form} />}
          >
            <TabPane key={1} tab="Write">
              <Form form={form}>
                <Form.Item name="typedComment" className="w-full mb-2">
                  <Input.TextArea
                    id="commentInput"
                    placeholder="Leave a comment"
                    autoSize={{ minRows: 6, maxRows: 12 }}
                    className="w-full rounded-md p-3"
                    ref={textAreaRef}
                    onKeyDown={(val) => shortcut(val)}
                    onChange={(val) => setComment(val.target.value)}
                  />
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane key={2} tab="Preview">
              <Space className="w-full p-3 pb-34">
                <ReactMarkdown className="pb-24">
                  {form.getFieldValue("typedComment")}
                </ReactMarkdown>
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
            <Button disabled={sendAvailable} onClick={() => sendMessage()} type="primary">
              Comment
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
