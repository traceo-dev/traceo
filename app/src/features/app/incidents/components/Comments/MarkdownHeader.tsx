import {
  BoldOutlined,
  CodeOutlined,
  FontSizeOutlined,
  ItalicOutlined,
  LinkOutlined,
  PictureOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { Space } from "antd";
import { joinClasses } from "../../../../../core/utils/classes";

export const MarkdownHeader = ({ form, className = "" }) => {
  const pasteMarkdownTag = (tag: string) => {
    const comment = form.getFieldValue("typedComment");
    form.setFieldsValue({
      typedComment: (comment || "") + tag
    });

    const el = document.getElementById("commentInput");
    el.focus();
  };

  return (
    <>
      <Space
        className={joinClasses("py-2 pr-3 mb-2 rounded-lg w-full justify-end", className)}
      >
        <FontSizeOutlined
          className="markdown-tag-btn"
          onClick={() => pasteMarkdownTag("### ")}
        />
        <BoldOutlined
          className="markdown-tag-btn"
          onClick={() => pasteMarkdownTag("** **")}
        />
        <ItalicOutlined
          className="markdown-tag-btn"
          onClick={() => pasteMarkdownTag("_ _")}
        />
        <CodeOutlined
          className="markdown-tag-btn"
          onClick={() => pasteMarkdownTag("` `")}
        />
        <UnorderedListOutlined
          className="markdown-tag-btn"
          onClick={() => pasteMarkdownTag("- ")}
        />
        <LinkOutlined
          className="markdown-tag-btn"
          onClick={() => pasteMarkdownTag("[name](url)")}
        />
        <PictureOutlined
          className="markdown-tag-btn"
          onClick={() => pasteMarkdownTag("![link](url)")}
        />
      </Space>
      <style>{`
        .markdown-tag-btn {
          cursor: pointer;
          padding-inline: 8px;
        }
        
        .markdown-tag-btn:hover {
          color: #348ac7;
        }
      `}</style>
    </>
  );
};
