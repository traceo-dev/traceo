import { ColumnSection } from "../../../../core/components/ColumnSection";
import { ADMIN_EMAIL } from "../../../../core/utils/constants";
import { useAppDispatch } from "../../../../store";
import { StoreState } from "../../../../store/types";
import { Card, Select, FieldLabel } from "@traceo/ui";
import { useSelector } from "react-redux";
import { updateUser } from "../../state/users/actions";

export const UserPermissions = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: StoreState) => state.adminUser);

  const isCoreAdmin = user.email === ADMIN_EMAIL;

  const onUpdateServerRole = (value: boolean) => {
    dispatch(updateUser({ id: user.id, admin: value }));
  };

  return (
    <Card title="Permissions">
      <ColumnSection subtitle="Manage permissions and access to all resources of this Traceo instance.">
        <FieldLabel className="w-2/3" label="Server Admin">
          <Select
            defaultValue={user.admin}
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
