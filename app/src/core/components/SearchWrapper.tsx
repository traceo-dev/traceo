import { joinClasses } from "../../core/utils/classes";

export const SearchWrapper = ({ children, className = "" }) => {
  return (
    <div className={joinClasses("flex flex-start relative text-left gap-2", className)}>
      {children}
    </div>
  );
};
