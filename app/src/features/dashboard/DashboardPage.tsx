import { useState } from "react";
import { AppsTable } from "./components/AppsTable";
import { PlusOutlined } from "@ant-design/icons";
import ServerPermissions from "../../core/components/ServerPermissions";
import { NewApplicationModal } from "../../core/components/Modals/NewApplicationModal";
import { Button } from "core/ui-components/Button";
import { Card } from "core/ui-components/Card";
import { Page } from "core/components/Page";

export const DashboardPage = () => {
  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);
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
