import { useEffect, useState } from "react";
import { Button, Card } from "@traceo/ui";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import ServerPermissions from "../../core/components/ServerPermissions";
import { NewApplicationModal } from "../../core/components/Modals/NewApplicationModal";
import { Page } from "../../core/components/Page";
import { loadAccount } from "../auth/state/actions";
import { useAppDispatch } from "../../store";
import { resetIncidentsState, resetIncidentState } from "../app/incidents/state/reducers";
import { resetApplicationState } from "../app/state/application/reducers";

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);

  useEffect(() => {
    dispatch(loadAccount());

    // Cleaning application stores
    dispatch(resetIncidentState());
    dispatch(resetIncidentsState());
    dispatch(resetApplicationState());
  }, []);

  return (
    <>
      <Page>
        <Card
          title="Applications"
          className="mt-5"
          extra={
            <ServerPermissions>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpenApplicationModal(true)}
              >
                New application
              </Button>
            </ServerPermissions>
          }
        >
          <AppsTable />
        </Card>
      </Page>
      <NewApplicationModal
        isOpen={openApplicationModal}
        onCancel={() => setOpenApplicationModal(false)}
      />
    </>
  );
};

export default DashboardPage;
