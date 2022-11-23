import { useEffect, useState } from "react";
import { AppNavBar } from "./AppNavBar";
import { DashboardNavBar } from "./DashboardNavBar";
import { useNavigate } from "react-router-dom";

type NavType = "app" | "dashboard";

export const NavBar = () => {
  const [type, setType] = useState<NavType>("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    setType(window.location.pathname.split("/")[1] as NavType);
  }, [navigate]);

  if (type === "app") {
    return <AppNavBar />;
  } else if (type === "dashboard") {
    return <DashboardNavBar />;
  } else {
    return null;
  }
};
