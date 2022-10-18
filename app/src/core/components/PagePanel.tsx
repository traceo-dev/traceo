import { Card } from "antd";
import { FC } from "react";
import { joinClasses } from "../utils/classes";

interface Props {
  children: JSX.Element | any;
  className?: string;
  title?: JSX.Element | string;
  extra?: JSX.Element;
}
export const PagePanel: FC<Props> = ({ children, className = "", title = "", extra }) => {
  return (
    <>
      <Card extra={extra} title={title} className={joinClasses("page-panel", className)}>
        {children}
      </Card>
      <style>{`
        .page-panel {
          background-color: var(--color-bg-primary);
          border: 1px solid rgba(204, 204, 220, 0.07);
          box-shadow: rgb(24 26 27 / 75%) 0px 1px 2px;
          margin-bottom: 8px;
          min-width: 100%;
        }
      `}</style>
    </>
  );
};
