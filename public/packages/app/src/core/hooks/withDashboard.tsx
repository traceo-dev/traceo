import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { BaseDashboardViewType } from "../types/hoc";
import { loadDashboard } from "../../features/project/overview/state/actions";
import { useSelector } from "react-redux";
import { StoreState } from "../../store/types";
import { TraceoLoading } from "../components/TraceoLoading";

const withDashboard = <T extends BaseDashboardViewType>(
  WrappedComponent: React.ComponentType<T>
) => {
  const render = (props) => {
    const { dashboardId } = useParams();
    const [_, setIsMounted] = useState(true);

    const state = useSelector((state: StoreState) => state.dashboard);
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(loadDashboard(dashboardId));

      return () => {
        setIsMounted(false);
      };
    }, [dashboardId]);

    if (state.isLoading) {
      return <TraceoLoading />;
    }

    return <WrappedComponent dashboard={state.dashboard} {...props} />;
  };

  return render;
};

export default withDashboard;
