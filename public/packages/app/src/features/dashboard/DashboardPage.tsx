import { useEffect, useState } from "react";
import { Button, Card } from "@traceo/ui";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import ServerPermissions from "../../core/components/ServerPermissions";
import { Page } from "../../core/components/Page";
import { loadSignedInUser } from "../auth/state/actions";
import { useAppDispatch } from "../../store";
import { resetIncidentsState, resetIncidentState } from "../app/incidents/state/reducers";
import { resetApplicationState } from "../app/state/application/reducers";
import { useNavigate } from "react-router-dom";
import { toggleNavbar } from "../../store/internal/navbar/actions";

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadSignedInUser());

    // Cleaning application stores
    dispatch(resetIncidentState());
    dispatch(resetIncidentsState());
    dispatch(resetApplicationState());
  }, []);

  const onNewApp = () => {
    navigate("/dashboard/app/new");
    dispatch(toggleNavbar(true));
  };

  return (
    <>
      <Page>
        <Card
          title="Applications"
          className="mt-5"
          extra={
            <ServerPermissions>
              <Button icon={<PlusOutlined />} onClick={() => onNewApp()}>
                New application
              </Button>
            </ServerPermissions>
          }
        >
          <AppsTable />
        </Card>
      </Page>
    </>
  );
};

export default DashboardPage;
