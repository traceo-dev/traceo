import { Typography, Radio, Button, Row, Space } from "antd";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../../core/components/Avatar";
import api from "../../../core/lib/api";
import { notify } from "../../../core/utils/notify";
import { ApplicationMember, MemberRole } from "../../../types/application";

export const ApplicationMemberDescriptionTable = ({ children }) => {
  return (
    <>
      <table className="details-table">
        <thead className="details-table-thead">
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      <style>{`
          .details-table-thead tr th {
            text-align: left;
            font-weight: 400;
          }
  
          .action-role {
            float: left;
          }

          .action-remove {
            float: right;
          }
        `}</style>
    </>
  );
};

interface DescriptionAppRadioRowProps {
  item: ApplicationMember;
  options: { label: string; value: string | number | boolean }[];
  postExecute?: () => void;
  type: "member" | "application";
}
export const DescriptionAppRadioRow: FC<DescriptionAppRadioRowProps> = ({
  options = [],
  item,
  postExecute,
  type
}) => {
  const navigate = useNavigate();
  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [value, setValue] = useState<MemberRole>();
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const onUpdateRole = async () => {
    setLoadingUpdate(true);
    try {
      await api.patch("/api/amr/application/member", {
        memberId: item.id,
        role: value
      });
      notify.success("Role updated");
    } catch (error) {
      notify.error("Error during change account role");
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
      notify.error("Error. Please try again later.");
    } finally {
      setDeleteMode(false);
      setLoadingDelete(false);
      postExecute();
    }
  };

  const navigateTo = () => {
    if (item.application?.name) {
      navigate(`/dashboard/management/apps/${item.application.id}`);
    } else {
      navigate(`/dashboard/management/accounts/${item.account.id}`);
    }
  };

  return (
    <>
      <tr>
        <td className="details-table-label">
          <Row
            onClick={() => navigateTo()}
            className="w-full items-center cursor-pointer"
          >
            {type === "member" ? (
              <Avatar
                shape="circle"
                size="small"
                className="mr-3"
                url={item.account?.gravatar}
                name={item.account?.name}
              />
            ) : (
              <Avatar
                shape="circle"
                size="small"
                className="mr-3"
                url={item.application?.gravatar}
                name={item.application?.name}
              />
            )}

            <Typography className="text-sm font-normal hover:text-amber-600">
              {item.application?.name || item.account.name}
            </Typography>
          </Row>
        </td>
        <td className="details-table-value" colSpan={2}>
          {updateMode ? (
            <Radio.Group
              options={options}
              onChange={(val) => setValue(val.target.value)}
              defaultValue={item?.role}
              optionType="button"
              buttonStyle="solid"
            />
          ) : (
            <Typography.Text className="text-sm font-normal">
              {item?.role}
            </Typography.Text>
          )}
        </td>
        <td className="action-remove" colSpan={1}>
          {!deleteMode ? (
            <Button danger type="primary" onClick={() => setDeleteMode(true)}>
              Remove from app
            </Button>
          ) : (
            <Space>
              <Button
                loading={loadingDelete}
                danger
                type="primary"
                onClick={() => onRemoveFromApp()}
              >
                Confirm
              </Button>
              <Button type="primary" onClick={() => setDeleteMode(false)} ghost>
                Cancel
              </Button>
            </Space>
          )}
        </td>
        <td className="action-role" colSpan={1}>
          {!updateMode ? (
            <Button type="primary" onClick={() => setUpdateMode(true)}>
              Change role
            </Button>
          ) : (
            <Space>
              <Button
                loading={loadingUpdate}
                type="primary"
                onClick={() => onUpdateRole()}
              >
                Save
              </Button>
              <Button type="primary" onClick={() => setUpdateMode(false)} ghost>
                Cancel
              </Button>
            </Space>
          )}
        </td>
      </tr>
    </>
  );
};
