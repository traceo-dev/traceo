import { joinClasses } from "src/core/utils/classes";

export const JavascriptIcon = ({ className = "" }) => {
  return <i className={joinClasses(className, "devicon-javascript-plain colored")} />;
};
