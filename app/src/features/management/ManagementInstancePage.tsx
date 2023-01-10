import { ContactsOutlined } from "@ant-design/icons";
import { Card } from "core/ui-components/Card/Card";
import { DescriptionInputRow, Descriptions } from "../../core/components/Descriptions";
import { CONTACT_EMAIL, VERSION } from "../../core/utils/constants";
import dateUtils from "../../core/utils/date";
import { ManagementNavigation } from "./components/ManagementNavigation";

const ManagementInstancePage = () => {
  return (
    <ManagementNavigation>
      <Card title="Basic Informations">
        <Descriptions>
          <DescriptionInputRow label="Name">
            © {new Date().getFullYear()} Traceo Platform
          </DescriptionInputRow>
          <DescriptionInputRow label="Version">{VERSION}</DescriptionInputRow>
          <DescriptionInputRow label="Timezone">
            {dateUtils.guessTz()}
          </DescriptionInputRow>
          <DescriptionInputRow label="Contact">
            <ContactsOutlined
              className="text-cyan-500"
              onClick={() => window.open(`mailto:${CONTACT_EMAIL}`)}
            />
          </DescriptionInputRow>
        </Descriptions>
      </Card>
    </ManagementNavigation>
  );
};

export default ManagementInstancePage;
