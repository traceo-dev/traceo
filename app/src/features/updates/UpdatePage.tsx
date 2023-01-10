import { InfoCircleOutlined } from "@ant-design/icons";
import { DashboardPage } from "../dashboard/components/DashboardPage";
import PageHeader from "../../core/components/PageHeader";

//TODO: remove this page
export const UpdatePage = () => {
  return (
    <DashboardPage>
      <PageHeader
        icon={<InfoCircleOutlined />}
        title={"Updates"}
        subTitle={"Recent informations about updates in Traceo app"}
      />
    </DashboardPage>
  );
};

export default UpdatePage;
