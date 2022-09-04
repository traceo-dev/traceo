import { joinClasses } from "src/core/utils/classes";

export const NestJsIcon = ({ className = "" }) => {
  return <i className={joinClasses(className, "devicon-nestjs-plain colored")} />;
};
