import { Card } from "@traceo/ui";
import { DescriptionRow, Descriptions } from "../../core/components/Descriptions";
import { VERSION } from "../../core/utils/constants";
import dateUtils from "../../core/utils/date";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";

const InstancePage = () => {
  return (
    <DashboardPageWrapper>
      <Card title="Basic Informations">
        <Descriptions>
          <DescriptionRow label="Name">
            © {new Date().getFullYear()} Traceo Platform
          </DescriptionRow>
          <DescriptionRow label="Version">{VERSION}</DescriptionRow>
          <DescriptionRow label="Timezone">{dateUtils.guessTz()}</DescriptionRow>
        </Descriptions>
      </Card>
    </DashboardPageWrapper>
  );
};

export default InstancePage;
