import { CloseOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import {
  DescriptionRadioRow,
  Descriptions
} from "src/core/components/Descriptions";
import PageHeader from "src/core/components/PageHeader";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";
import { updateServerAccount } from "../../state/accounts/actions";
import { DetailsSection } from "../../../../core/components/DetailsSection";

export const AccountPermissions = () => {
  const { account } = useSelector((state: StoreState) => state.serverAccounts);

  const onUpdateServerRole = (value: boolean) => {
    dispatch(updateServerAccount({ id: account.id, isAdmin: value }));
  }
    
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
