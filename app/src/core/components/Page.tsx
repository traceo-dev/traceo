import { FC } from "react";
import { joinClasses } from "../../core/utils/classes";

interface Props {
  children: JSX.Element;
  className?: string;
}
export const Page: FC<Props> = ({ children, className = "" }) => {
  return (
    <>
      <div className="scrollbar-view">
        <div className={joinClasses("page-scrollbar-content", className)}>{children}</div>
      </div>
      <style>{`
        .page-scrollbar-content {
          display: block;
          min-height: 100%;
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding: 48px;
          padding-top: 20px;
        }

        .scrollbar-view {
          position: relative;
          overflow: scroll;
          overflow-x: hidden;
          display: flex;
          -webkit-box-flex: 1;
          flex-grow: 1;
          flex-direction: column;
          height: 100%;
        }
      `}</style>
    </>
  );
};
