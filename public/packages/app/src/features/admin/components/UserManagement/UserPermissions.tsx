import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../store";
import { StoreState } from "@store/types";
import { updateUser } from "../../state/accounts/actions";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { Card, Select, FieldLabel } from "@traceo/ui";
import { ColumnSection } from "../../../../core/components/ColumnSection";

export const UserPermissions = () => {
  const dispatch = useAppDispatch();
  const { account } = useSelector((state: StoreState) => state.serverAccounts);

  const isCoreAdmin = account.email === ADMIN_EMAIL;

  const onUpdateServerRole = (value: boolean) => {
    dispatch(updateUser({ id: account.id, isAdmin: value }));
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
