import { useEffect, useState } from "react";
import { AppNavBar } from "./AppNavBar";
import { DashboardNavBar } from "./DashboardNavBar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";
import { conditionClass } from "core/utils/classes";

type NavType = "app" | "dashboard";

export const NavBar = () => {
  const [type, setType] = useState<NavType>("dashboard");
  const { hidden } = useSelector((state: StoreState) => state.navbar);

  const navigate = useNavigate();

  useEffect(() => {
    setType(window.location.pathname.split("/")[1] as NavType);
  }, [navigate]);

  const renderNavbar = () => {
    if (type === "app") {
      return <AppNavBar />;
    } else if (type === "dashboard") {
      return <DashboardNavBar />;
    } else {
      return null;
    }
  };

  return <div className={conditionClass(hidden, "hidden")}>{renderNavbar()}</div>;
};
