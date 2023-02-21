import { conditionClass } from "../../../utils/classes";
import { AppNavBar } from "./AppNavBar";
import { DashboardNavBar } from "./DashboardNavBar";
import { StoreState } from "@store/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type NavType = "app" | "dashboard";

export const NavBar = () => {
  const [type, setType] = useState<NavType>("dashboard");
  const { hidden } = useSelector((state: StoreState) => state.navbar);

  const navigate = useNavigate();

  useEffect(() => {
    setType(window.location.pathname.split("/")[1] as NavType);
  }, [navigate]);

  const renderNavbar = () => {
    switch (type) {
      case "app":
        return <AppNavBar />;
      case "dashboard":
        return <DashboardNavBar />;
      default:
        return null;
    }
  };

  return <div className={conditionClass(hidden, "hidden")}>{renderNavbar()}</div>;
};
