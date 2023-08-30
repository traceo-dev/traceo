import { PlusOutlined } from "@ant-design/icons";
import { DATASOURCE_PROVIDER, MemberRole } from "@traceo/types";
import { Card, Button } from "@traceo/ui";
import { Fragment, useState } from "react";
import SettingsPageWrapper from "./components/SettingsPageWrapper";
import { Permissions } from "../../../core/components/Permissions";
import { AddDatasourceModal } from "./components/AddDatasourceModal";

const DatasourceListPage = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <SettingsPageWrapper>
        <Card
          title="Datasources"
          extra={
            <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
              <Button onClick={() => setModalOpen(true)} icon={<PlusOutlined />}>
                Add
              </Button>
            </Permissions>
          }
        ></Card>
      </SettingsPageWrapper>
      <AddDatasourceModal isOpen={isModalOpen} onCancel={() => setModalOpen(false)} />
    </Fragment>
  );
};

export default DatasourceListPage;
