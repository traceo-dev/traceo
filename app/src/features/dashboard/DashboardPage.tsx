import { useEffect, useState } from "react";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import ServerPermissions from "../../core/components/ServerPermissions";
import { NewApplicationModal } from "../../core/components/Modals/NewApplicationModal";
import { Button } from "core/ui-components/Button";
import { Card } from "core/ui-components/Card";
import { Page } from "core/components/Page";
import { loadAccount } from "features/auth/state/actions";
import { useAppDispatch } from "store";
import {
  resetIncidentsState,
  resetIncidentState
} from "features/app/incidents/state/reducers";
import { resetApplicationState } from "features/app/state/application/reducers";

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
    <Page>
      <Card
        title="Applications"
        className="mt-5"
        extra={
          <ServerPermissions>
            <NewApplicationModal
              isOpen={openApplicationModal}
              onCancel={() => setOpenApplicationModal(false)}
            >
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpenApplicationModal(true)}
              >
                New application
              </Button>
            </NewApplicationModal>
          </ServerPermissions>
        }
      >
        <AppsTable />
      </Card>
    </Page>
  );
};

export default DashboardPage;
