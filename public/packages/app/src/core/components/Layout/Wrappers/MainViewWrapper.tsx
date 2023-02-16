export const MainViewWrapper = ({ children }) => {
  return (
    <div className="flex w-full flex-col overflow-x-hidden">
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};
