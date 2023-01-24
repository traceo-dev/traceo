import { ContactsOutlined } from "@ant-design/icons";
import { Card } from "core/ui-components/Card";
import { DescriptionRow, Descriptions } from "../../core/components/Descriptions";
import { CONTACT_EMAIL, VERSION } from "../../core/utils/constants";
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
          <DescriptionRow label="Contact">
            <ContactsOutlined
              className="text-cyan-500"
              onClick={() => window.open(`mailto:${CONTACT_EMAIL}`)}
            />
          </DescriptionRow>
        </Descriptions>
      </Card>
    </DashboardPageWrapper>
  );
};

export default InstancePage;
