import { Space } from "antd";
import { joinClasses } from "../utils/classes";

export const PagePanel = ({ children, className = "" }) => {
  return (
    <>
      <Space direction="vertical" className={joinClasses("page-panel", className)}>
        {children}
      </Space>
      <style>{`
        .page-panel {
          background-color: var(--color-bg-primary);
          // border: 2px solid rgba(204, 204, 220, 0.07);
          border-radius: 4px;
          box-shadow: rgb(24 26 27 / 75%) 0px 1px 2px;
          padding: 32px;
          margin-bottom: 8px;
          min-width: 100%;
        }
      `}</style>
    </>
  );
};
