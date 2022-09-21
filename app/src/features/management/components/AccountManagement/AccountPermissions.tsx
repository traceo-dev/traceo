import { CloseOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import {
  DescriptionRadioRow,
  Descriptions
} from "../../../../core/components/Descriptions";
import PageHeader from "../../../../core/components/PageHeader";
import { dispatch } from "../../../../store/store";
import { StoreState } from "../../../../types/store";
import { updateServerAccount } from "../../state/accounts/actions";
import { DetailsSection } from "../../../../core/components/DetailsSection";

export const AccountPermissions = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);

  const isAdmin = account.email === "admin@localhost";

  const onUpdateServerRole = (value: boolean) => {
    dispatch(updateServerAccount({ id: account.id, isAdmin: value }));
  };

  return (
    <DetailsSection>
      <PageHeader
        fontSize={22}
        title="Permissions"
        subTitle="Current permissions for this account"
        className="pb-5"
      />
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
            <Typography.Text>
              Admin <SafetyCertificateOutlined />
            </Typography.Text>
          ) : (
            <Typography.Text>
              No <CloseOutlined />
            </Typography.Text>
          )}
        </DescriptionRadioRow>
      </Descriptions>
    </DetailsSection>
  );
};
