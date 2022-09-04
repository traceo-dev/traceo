import { joinClasses } from "src/core/utils/classes";

export const ElectronIcon = ({ className = "" }) => {
  return <i className={joinClasses(className, "devicon-electron-original colored")} />;
};
