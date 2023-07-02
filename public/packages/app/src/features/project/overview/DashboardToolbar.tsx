import {
  PlusOutlined,
  AppstoreOutlined,
  SettingOutlined,
  AppstoreFilled,
  DragOutlined
} from "@ant-design/icons";
import { Dashboard, MemberRole, Setter, TimeRange } from "@traceo/types";
import { Row, Select, TimeRangePicker } from "@traceo/ui";
import { useNavigate, useParams } from "react-router-dom";
import { ActionButton } from "src/core/components/ActionButton";
import { useProject } from "src/core/hooks/useProject";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import dayjs from "dayjs";
import { relativeTimeOptions } from "../explore/components/utils";
import { Permissions } from "src/core/components/Permissions";
import { useSelector } from "react-redux";
import { StoreState } from "@store/types";
import { stat } from "fs";

const MAX_DATE = new Date(dayjs().unix() * 1e3);

interface Props {
  ranges: TimeRange;
  onChangeRanges: Setter<TimeRange>;
  isEditable: boolean;
  onChangeEditable: Setter<boolean>;
}
export const DashboardToolbar = ({
  ranges = [undefined, undefined],
  onChangeRanges = undefined,
  isEditable = false,
  onChangeEditable = undefined
}: Props) => {
  const { did } = useParams();

  const { project } = useProject();
  const navigate = useNavigate();

  const { dashboard } = useSelector((state: StoreState) => state.dashboard);

  const { data: dashboards = [], isLoading } = useReactQuery<Dashboard[]>({
    queryKey: [`dashboards_${project.id}`],
    url: `/api/dashboard/project/${project.id}`
  });

  const onSelectDashboard = (id: string) => {
    navigate({
      pathname: `/project/${project.id}/dashboard/${id}`
    });
  };

  const onEditDashboard = () => {
    navigate({
      pathname: `/project/${project.id}/dashboard/${did}/edit`
    });
  };

  return (
    <Row className="justify-between mb-2">
      <Row className="items-center" gap="x-3">
        <Select
          variant="secondary"
          isLoading={isLoading}
          value={did}
          options={dashboards.map((dashboard) => ({
            label: dashboard.name,
            value: dashboard.id,
            icon: <AppstoreFilled />
          }))}
          onChange={(opt) => onSelectDashboard(opt?.value)}
        />
      </Row>
      <Row className="items-center" gap="x-3">
        <TimeRangePicker
          value={ranges}
          options={relativeTimeOptions}
          submit={(val: TimeRange) => onChangeRanges(val)}
          datesRange={true}
          maxDate={MAX_DATE}
          type="secondary"
        />
        {dashboard.isEditable && (
          <ActionButton
            onClick={() => onChangeEditable(!isEditable)}
            isActive={isEditable}
            tooltip="Drag panels"
            inactiveColor="bg-primary"
            icon={<DragOutlined />}
          />
        )}
        <Permissions statuses={[MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER]}>
          <ActionButton
            onClick={() => onEditDashboard()}
            tooltip="Edit dashboard"
            inactiveColor="bg-primary"
            icon={<SettingOutlined />}
          />
        </Permissions>
      </Row>
    </Row>
  );
};
