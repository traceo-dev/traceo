import { joinClasses } from "src/core/utils/classes";

export const TypescriptIcon = ({ className = "" }) => {
  return <i className={joinClasses(className, "devicon-typescript-plain colored")} />;
};
