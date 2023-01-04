import { joinClasses } from "../../core/utils/classes";

export const SearchWrapper = ({ children, className = "" }) => {
  return (
    <>
      <div className={joinClasses("search-wrapper gap-2", className)}>{children}</div>
      <style>{`
            .search-wrapper {
                align-items: flex-start;
                display: flex;
                position: relative;
                text-align: left;
            }
        `}</style>
    </>
  );
};
