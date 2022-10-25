import { Row, Radio, Button } from "antd";
import { Avatar } from "../../../../core/components/Avatar";
import api from "../../../../core/lib/api";
import { TRY_AGAIN_LATER_ERROR } from "../../../../core/utils/constants";
import { notify } from "../../../../core/utils/notify";
import { FC, useState } from "react";
import { ApplicationMember, MemberRole } from "../../../../types/application";
import { ActionButtons } from "../RowActionButtons";

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
  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [value, setValue] = useState<MemberRole>();
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const options = [
    { label: "Administrator", value: MemberRole.ADMINISTRATOR },
    { label: "Maintainer", value: MemberRole.MAINTAINER },
    { label: "Viewer", value: MemberRole.VIEWER }
  ];

  const onUpdateRole = async () => {
    setLoadingUpdate(true);
    try {
      await api.patch("/api/amr/application/member", {
        memberId: item.id,
        role: value
      });
      notify.success("Role updated");
    } catch (error) {
      notify.error(TRY_AGAIN_LATER_ERROR);
    } finally {
      setUpdateMode(false);
      setLoadingUpdate(false);
      postExecute();
    }
  };

  const onRemoveFromApp = async () => {
    setLoadingDelete(true);
    try {
      await api.delete("/api/amr/application/member", { id: item.id });
      notify.success("Removed from app.");
    } catch (error) {
      notify.error(TRY_AGAIN_LATER_ERROR);
    } finally {
      setDeleteMode(false);
      setLoadingDelete(false);
      postExecute();
    }
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
        <td className="w-96" colSpan={2}>
          {updateMode ? (
            <Radio.Group
              options={options}
              onChange={(val) => setValue(val.target.value)}
              defaultValue={item?.role}
              optionType="button"
              buttonStyle="solid"
            />
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
              onClick={() => setDeleteMode(true)}
            >
              Remove from app
            </Button>
          ) : (
            <ActionButtons
              loading={loadingDelete}
              onCancel={() => setDeleteMode(false)}
              onSave={() => onRemoveFromApp()}
            />
          )}
        </td>
        <td className="float-left" colSpan={1}>
          {!updateMode ? (
            <Button hidden={!editable} type="primary" onClick={() => setUpdateMode(true)}>
              Change role
            </Button>
          ) : (
            <ActionButtons
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
