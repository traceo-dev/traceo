import { joinClasses } from "src/core/utils/classes";

export const ExpressIcon = ({ className = "" }) => {
  return <i className={joinClasses(className, "devicon-express-original-wordmark")} />;
};
