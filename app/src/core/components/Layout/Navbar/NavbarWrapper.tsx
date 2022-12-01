export const NavbarWrapper = ({ children }) => {
  return (
    <>
      <div className="h-full w-56 overflow-auto pt-12">
        <nav className="sidemenu">{children}</nav>
      </div>
      <style>{`
          .sidemenu {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 8px 0px;
            border-right: 1px solid var(--color-bg-secondary);
          }
        `}</style>
    </>
  );
};
