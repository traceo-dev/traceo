import { Row } from "antd";
import api from "../../../../core/lib/api";
import { FC, useState } from "react";
import { MemberApplication, MemberRole } from "../../../../types/application";
import { RowActionButtons } from "../RowActionButtons";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { useNavigate } from "react-router-dom";
import { Button } from "core/ui-components/Button";
import { Select } from "core/ui-components/Select";
import { Avatar } from "core/ui-components/Avatar";

interface ApplicationRowProps {
  item: MemberApplication;
  postExecute?: () => void;
  editable?: boolean;
}
export const ApplicationTableRow: FC<ApplicationRowProps> = ({
  item,
  postExecute,
  editable = true
}) => {
  const { account } = useSelector((state: StoreState) => state.account);
  const navigate = useNavigate();

  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [role, setRole] = useState<MemberRole>();
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const options = [
    { label: "Administrator", value: MemberRole.ADMINISTRATOR },
    { label: "Maintainer", value: MemberRole.MAINTAINER },
    { label: "Viewer", value: MemberRole.VIEWER }
  ];

  const onUpdateRole = async () => {
    setLoadingUpdate(true);
    await api
      .patch("/api/amr/application/member", {
        memberId: item.id,
        role: role
      })
      .finally(() => {
        setUpdateMode(false);
        setLoadingUpdate(false);
        postExecute();
      });
  };

  const onRemoveFromApp = async () => {
    setLoadingDelete(true);
    await api
      .delete("/api/amr/application/member", {
        id: item.id
      })
      .finally(() => {
        setDeleteMode(false);
        setLoadingDelete(false);
        postExecute();

        // In case when account remove himself from app
        if (item?.id === account.id) {
          navigate("/dashboard/overview");
        }
      });
  };

  const renderRoleCell = () => {
    if (updateMode) {
      return (
        <Select
          defaultValue={item?.role}
          options={options}
          onChange={(opt) => setRole(opt?.value)}
        />
      );
    }

    return item?.role;
  };

  const renderRemoveFromAppCell = () => {
    if (!deleteMode) {
      return (
        <Button
          hidden={!editable}
          variant="danger"
          size="xs"
          onClick={() => setDeleteMode(true)}
        >
          Remove from app
        </Button>
      );
    }

    return (
      <RowActionButtons
        loading={loadingDelete}
        onCancel={() => setDeleteMode(false)}
        onSave={() => onRemoveFromApp()}
      />
    );
  };

  const renderChangeRoleCell = () => {
    if (!updateMode) {
      return (
        <Button hidden={!editable} size="xs" onClick={() => setUpdateMode(true)}>
          Change role
        </Button>
      );
    }

    return (
      <RowActionButtons
        loading={loadingUpdate}
        onCancel={() => setUpdateMode(false)}
        onSave={() => onUpdateRole()}
      />
    );
  };

  return (
    <tr>
      <td className="w-64">
        <Row className="w-full items-center">
          <Avatar size="sm" className="mr-3" src={item?.gravatar} alt={item?.name} />
          {item.name}
        </Row>
      </td>
      <td className="w-64" colSpan={2}>
        {renderRoleCell()}
      </td>
      <td className="float-right" colSpan={1}>
        {renderRemoveFromAppCell()}
      </td>
      <td className="float-left" colSpan={1}>
        {renderChangeRoleCell()}
      </td>
    </tr>
  );
};
