import { joinClasses } from "src/core/utils/classes";

export const NodeJsIcon = ({ className = "" }) => {
  return <i className={joinClasses(className, "devicon-nodejs-plain colored")} />;
};
