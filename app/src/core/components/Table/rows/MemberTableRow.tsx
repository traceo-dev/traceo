import { Row, Button, Select } from "antd";
import { Avatar } from "../../../../core/components/Avatar";
import api from "../../../../core/lib/api";
import { FC, useState } from "react";
import { ApplicationMember, MemberRole } from "../../../../types/application";
import { RowActionButtons } from "../RowActionButtons";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { useNavigate } from "react-router-dom";

interface MemberRowProps {
  item: ApplicationMember;
  postExecute?: () => void;
  editable?: boolean;
  type: "application" | "account";
}
export const MemberTableRow: FC<MemberRowProps> = ({
  item,
  postExecute,
  editable = true,
  type = "account"
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
        if (item?.account.id === account.id) {
          navigate("/dashboard/overview");
        }
      });
  };

  return (
    <>
      <tr>
        <td className="w-64">
          <Row className="w-full items-center">
            <Avatar
              shape="circle"
              size="small"
              className="mr-3"
              url={item[type]?.gravatar}
              name={item[type]?.name}
            />
            {item[type].name}
          </Row>
        </td>
        {type === "account" && <td className="w-64">{item?.account?.email}</td>}
        <td className="w-64" colSpan={2}>
          {updateMode ? (
            <Select
              style={{ width: "160px" }}
              defaultValue={item?.role}
              onChange={(val) => setRole(val)}
            >
              {options.map((option) => (
                <Select.Option key={option.value}>{option.label}</Select.Option>
              ))}
            </Select>
          ) : (
            item?.role
          )}
        </td>
        <td className="float-right" colSpan={1}>
          {!deleteMode ? (
            <Button
              hidden={!editable}
              danger
              type="primary"
              size="small"
              onClick={() => setDeleteMode(true)}
            >
              Remove from app
            </Button>
          ) : (
            <RowActionButtons
              loading={loadingDelete}
              onCancel={() => setDeleteMode(false)}
              onSave={() => onRemoveFromApp()}
            />
          )}
        </td>
        <td className="float-left" colSpan={1}>
          {!updateMode ? (
            <Button
              hidden={!editable}
              type="primary"
              size="small"
              onClick={() => setUpdateMode(true)}
            >
              Change role
            </Button>
          ) : (
            <RowActionButtons
              loading={loadingUpdate}
              onCancel={() => setUpdateMode(false)}
              onSave={() => onUpdateRole()}
            />
          )}
        </td>
      </tr>
    </>
  );
};
