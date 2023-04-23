import { CheckOutlined, CloseOutlined, TeamOutlined } from "@ant-design/icons";
import { AlertStatus } from "@traceo/types";
import {
  Avatar,
  Card,
  FieldLabel,
  Select,
  SelectOptionProps,
  Space,
  Table,
  TableColumn,
  Typography
} from "@traceo/ui";
import dateUtils from "src/core/utils/date";
import { mapRuleTypeToString } from "./utils";
import AlertPageWrapper from "./components/AlertPageWrapper";
import { StoreState } from "@store/types";
import { useSelector } from "react-redux";
import api from "src/core/lib/api";
import { useAppDispatch } from "src/store";
import { loadAlert } from "./state/actions";

const statusOptions: SelectOptionProps[] = Object.values(AlertStatus).map((e) => ({
  label: e,
  value: e
}));

const AlertPreviewPage = () => {
  const dispatch = useAppDispatch();
  const { alert } = useSelector((state: StoreState) => state.alert);
  const recipientsSize = alert?.recipients?.length;

  const onChangeStatus = async (status: AlertStatus) => {
    console.log(status)
    await api.patch(`/api/alert/${alert.id}`, { ...alert, status }).then(() => {
      dispatch(loadAlert(alert.id));
    });
  };

  return (
    <AlertPageWrapper>
      <div className="w-full grid grid-cols-12">
        <div className="col-span-9">
          <Card title="Rules">
            <Table collection={alert?.rules}>
              <TableColumn name="Rule">{({ item }) => mapRuleTypeToString(item)}</TableColumn>
              <TableColumn name="Last triggered" value="lastTriggered" />
            </Table>
          </Card>
          <Card title="Recipients">
            {recipientsSize === 0 && (
              <Space className="py-12 justify-center flex flex-col w-full">
                <TeamOutlined className="text-2xl" />
                <Typography className="font-semibold">
                  This alert is addressed to all project members
                </Typography>
              </Space>
            )}

            {recipientsSize > 0 && (
              <Table collection={alert?.recipients}>
                <TableColumn width={5}>
                  {({ item }) => (
                    <Avatar size="sm" src={item?.user.gravatar} alt={item?.user.name} />
                  )}
                </TableColumn>
                <TableColumn name="Name" value="user.name" />
                <TableColumn name="Email" value="user.email" />
                <TableColumn name="Email notify">
                  {({ item }) =>
                    item.user.email && alert?.emailNotification ? (
                      <CheckOutlined />
                    ) : (
                      <CloseOutlined />
                    )
                  }
                </TableColumn>
                <TableColumn name="In-app notify">
                  {() => (alert?.inAppNotification ? <CheckOutlined /> : <CloseOutlined />)}
                </TableColumn>
              </Table>
            )}
          </Card>
        </div>
        <div className="col-span-3 ml-1">
          <Card title="Info">
            <FieldLabel label="Status">
              <Select
                onChange={(e) => onChangeStatus(e?.value)}
                value={alert?.status}
                options={statusOptions}
              />
            </FieldLabel>
            <FieldLabel label="Last triggered at">
              <Typography size="sm" weight="normal">
                {dateUtils.formatDate(alert?.lastTriggered, "DD MMM YYYY, HH:mm")}
              </Typography>
            </FieldLabel>
            <FieldLabel label="Min. time interval">
              <Typography size="sm" weight="normal">
                {alert?.minTimeInterval}m
              </Typography>
            </FieldLabel>
            <FieldLabel label="In-app notification">
              <span>{alert?.inAppNotification ? <CheckOutlined /> : <CloseOutlined />}</span>
            </FieldLabel>
            <FieldLabel label="Email notification">
              <span>{alert?.emailNotification ? <CheckOutlined /> : <CloseOutlined />}</span>
            </FieldLabel>
          </Card>
        </div>
      </div>
    </AlertPageWrapper>
  );
};

export default AlertPreviewPage;
