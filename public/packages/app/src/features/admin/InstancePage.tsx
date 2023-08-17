import { useConfig } from "../../core/contexts/ConfigsContextProvider";
import { DescriptionRow, Descriptions } from "../../core/components/Descriptions";
import dateUtils from "../../core/utils/date";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { Card } from "@traceo/ui";

const InstancePage = () => {
  const { version } = useConfig();
  return (
    <DashboardPageWrapper>
      <Card title="Basic Informations">
        <Descriptions>
          <DescriptionRow label="Name">
            © {new Date().getFullYear()} Traceo Platform
          </DescriptionRow>
          <DescriptionRow label="Version">{version}</DescriptionRow>
          <DescriptionRow label="Timezone">{dateUtils.guessTz()}</DescriptionRow>
        </Descriptions>
      </Card>
    </DashboardPageWrapper>
  );
};

export default InstancePage;
