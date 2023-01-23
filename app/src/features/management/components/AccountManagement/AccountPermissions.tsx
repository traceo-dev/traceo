import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../store";
import { StoreState } from "../../../../types/store";
import { updateServerAccount } from "../../state/accounts/actions";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { Card } from "core/ui-components/Card";
import { ColumnSection } from "core/components/ColumnSection";
import { Select } from "core/ui-components/Select";
import { FieldLabel } from "core/ui-components/Form/FieldLabel";

export const AccountPermissions = () => {
  const dispatch = useAppDispatch();
  const { account } = useSelector((state: StoreState) => state.serverAccounts);

  const isCoreAdmin = account.email === ADMIN_EMAIL;

  const onUpdateServerRole = (value: boolean) => {
    dispatch(updateServerAccount({ id: account.id, isAdmin: value }));
  };

  return (
    <Card title="Permissions">
      <ColumnSection subtitle="Manage permissions and access to all resources of this Traceo instance.">
        <FieldLabel className="w-2/3" label="Server Admin">
          <Select
            defaultValue={account.isAdmin}
            isDisabled={isCoreAdmin}
            onChange={(opt) => onUpdateServerRole(opt?.value)}
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false }
            ]}
          />
        </FieldLabel>
      </ColumnSection>
    </Card>
  );
};
