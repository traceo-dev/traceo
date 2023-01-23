import { InfoCircleOutlined } from "@ant-design/icons";
import { DashboardWrapper } from "../dashboard/components/DashboardPage";
import { PageHeader } from "core/ui-components/PageHeader";

//TODO: remove this page
export const UpdatePage = () => {
  return (
    <DashboardWrapper>
      <PageHeader
        icon={<InfoCircleOutlined />}
        title={"Updates"}
        description={"Recent informations about updates in Traceo app"}
      />
    </DashboardWrapper>
  );
};

export default UpdatePage;
