export const NavbarWrapper = ({ children }) => {
  return (
    <>
      <div className="h-full w-14 overflow-auto">
        <nav className="sidemenu" style={{ height: "100vh" }}>
          {children}
        </nav>
      </div>
      <style>{`
          .sidemenu {
            display: flex;
            flex-direction: column;
            background-color: var(--color-bg-primary);
            padding: 8px 0px;
            border-right: 1px solid rgba(204, 204, 220, 0.07);
          }
        `}</style>
    </>
  );
};
