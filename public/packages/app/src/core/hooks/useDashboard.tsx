import { useParams } from "react-router-dom";
import { StoreState } from "../../store/types";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useAppDispatch } from "src/store";
import { loadDashboard } from "src/features/project/overview/state/actions";

export const useDashboard = () => {
  const { dashboardId } = useParams();

  const dispatch = useAppDispatch();
  const state = useSelector((state: StoreState) => state.dashboard);

  useEffect(() => {
    dispatch(loadDashboard(dashboardId));
  }, [dashboardId]);

  return { ...state };
};
