import { CloseOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  DescriptionRadioRow,
  Descriptions
} from "../../../../core/components/Descriptions";
import { dispatch } from "../../../../store/store";
import { StoreState } from "../../../../types/store";
import { updateServerAccount } from "../../state/accounts/actions";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { Typography } from "core/ui-components/Typography/Typography";
import { Card } from "core/ui-components/Card/Card";

export const AccountPermissions = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);

  const isAdmin = account.email === ADMIN_EMAIL;

  const onUpdateServerRole = (value: boolean) => {
    dispatch(updateServerAccount({ id: account.id, isAdmin: value }));
  };

  return (
    <Card title="Permissions">
      <Descriptions>
        <DescriptionRadioRow
          label="Server Admin"
          onUpdate={onUpdateServerRole}
          options={[
            { label: "Yes", value: true },
            { label: "No", value: false }
          ]}
          defaultValue={account.isAdmin}
          editable={!isAdmin}
        >
          {account.isAdmin ? (
            <Typography>
              Admin <SafetyCertificateOutlined />
            </Typography>
          ) : (
            <Typography>
              No <CloseOutlined />
            </Typography>
          )}
        </DescriptionRadioRow>
      </Descriptions>
    </Card>
  );
};
