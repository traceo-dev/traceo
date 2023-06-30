import { PlusOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Dashboard, TimeRange } from "@traceo/types";
import { Row, Select, TimeRangePicker } from "@traceo/ui";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionButton } from "src/core/components/ActionButton";
import { AddDashboardModal } from "src/core/components/Modals/AddDashboardModal";
import { useProject } from "src/core/hooks/useProject";
import { useReactQuery } from "src/core/hooks/useReactQuery";
import { useTimeRange } from "src/core/hooks/useTimeRange";
import dayjs from "dayjs";
import { relativeTimeOptions } from "../explore/components/utils";

const MAX_DATE = new Date(dayjs().unix() * 1e3);

export const DashboardToolbar = () => {
  const { did } = useParams();

  const { project } = useProject();
  const navigate = useNavigate();

  const [isDashbordModal, setDashboardModal] = useState<boolean>(false);

  const onAddDashboard = () => setDashboardModal(true);

  const { data: dashboards = [], isLoading } = useReactQuery<Dashboard[]>({
    queryKey: [`dashboards_${project.id}`],
    url: `/api/dashboard/project/${project.id}`
  });

  const { ranges, setRanges } = useTimeRange({
    from: dayjs().subtract(30, "minute").unix(),
    to: dayjs().unix()
  });

  const onSelectDashboard = (id: string) => {
    navigate({
      pathname: `/project/${project.id}/dashboard/${id}`
    });
  };

  const onAddPanel = () => {
    navigate({
      pathname: `/project/${project.id}/dashboard/${did}/panel-create`
    });
  };

  return (
    <>
      <Row className="justify-between mb-2">
        <Row className="items-center" gap="x-3">
          <Select
            variant="secondary"
            isLoading={isLoading}
            value={did}
            options={dashboards.map((dashboard) => ({
              label: dashboard.name,
              value: dashboard.id,
              icon: <AppstoreOutlined />
            }))}
            onChange={(opt) => onSelectDashboard(opt?.value)}
          />
          <ActionButton
            onClick={() => onAddDashboard()}
            inactiveColor="bg-primary"
            icon={<PlusOutlined />}
            name="Add dashboard"
          />
          <ActionButton
            onClick={() => onAddPanel()}
            inactiveColor="bg-primary"
            icon={<PlusOutlined />}
            name="Add panel"
          />
        </Row>
        <TimeRangePicker
          value={ranges}
          options={relativeTimeOptions}
          submit={(val: TimeRange) => setRanges(val)}
          datesRange={true}
          maxDate={MAX_DATE}
          type="secondary"
        />
      </Row>
      <AddDashboardModal isOpen={isDashbordModal} onCancel={() => setDashboardModal(false)} />
    </>
  );
};
