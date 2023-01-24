export const NavbarWrapper = ({ children }) => {
  return (
    <div className="h-full w-56 overflow-auto pt-12">
      <nav className="flex flex-col h-full py-2 border-solid border-r border-secondary border-t-0 border-b-0 border-l-0">
        {children}
      </nav>
    </div>
  );
};
