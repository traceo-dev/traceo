import {
  BarChartOutlined,
  ClockCircleOutlined,
  NumberOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {
  ButtonContainer,
  Button,
  Space,
  Modal,
  SelectOptionProps,
  Col,
  Typography,
  Collapse,
  CollapseItem
} from "@traceo/ui";
import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChoosePanelGrid } from "./DashboardGrid/ChoosePanelGrid";
import { ApiResponse, DASHBOARD_PANEL_TYPE, DashboardPanel } from "@traceo/types";
import api from "../../../../core/lib/api";
import { dashboardPanelOptions } from "../utils";
import { useAppDispatch } from "../../../../store/index";
import { loadDashboard } from "../state/actions";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
}

const eventsPanels: SelectOptionProps[] = [
  {
    label: "Today's events",
    value: "todays_events",
    icon: <BarChartOutlined />
  },
  {
    label: "Last month events",
    value: "overview_events",
    icon: <BarChartOutlined />
  },
  {
    label: "Last event at",
    value: "last_event_at",
    icon: <ClockCircleOutlined />
  },
  {
    label: "Today events count",
    value: "today_events_count",
    icon: <NumberOutlined />
  }
];

const customPanels: SelectOptionProps[] = [
  {
    label: "Custom",
    value: "custom",
    icon: <PlusOutlined />
  }
];

export const SelectPanelModal: FC<Props> = ({ isOpen, onCancel }) => {
  const { id, dashboardId } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [selectedPanel, setSelectedPanel] = useState<DASHBOARD_PANEL_TYPE>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const onConfirm = async () => {
    if (selectedPanel === "custom") {
      navigate({
        pathname: `/project/${id}/dashboard/${dashboardId}/panel-create`,
        search: `?type=${selectedPanel}`
      });
      onCancel();
    } else {
      setLoading(true);
      const props = {
        ...dashboardPanelOptions[selectedPanel],
        type: selectedPanel,
        dashboardId: dashboardId
      };
      await api.post<ApiResponse<DashboardPanel>>(`/api/dashboard/panel`, props).finally(() => {
        dispatch(loadDashboard(dashboardId));
        setLoading(false);
        onCancel();
      });
    }
  };

  return (
    <Modal size="xl" title="Select dashboard panel" open={isOpen} onCancel={onCancel}>
      <Space direction="vertical" className="pt-0 px-4 w-full h-full justify-between text-center">
        <Collapse ghost>
          <CollapseItem
            panelKey="events_section"
            collapsible={false}
            header={
              <Col className="text-start">
                <Typography weight="semibold">Panels from library</Typography>
                <Typography size="xs">
                  Panels containing information about all events occurring in this project.
                </Typography>
              </Col>
            }
          >
            <ChoosePanelGrid
              options={eventsPanels}
              onSelect={(v) => setSelectedPanel(v)}
              selected={selectedPanel}
            />
          </CollapseItem>
          <CollapseItem
            panelKey="custom_section"
            collapsible={false}
            header={
              <Col className="text-start">
                <Typography weight="semibold">Custom</Typography>
                <Typography size="xs">
                  Create a custom visualization for the data you need.
                </Typography>
              </Col>
            }
          >
            <ChoosePanelGrid
              options={customPanels}
              onSelect={(v) => setSelectedPanel(v)}
              selected={selectedPanel}
            />
          </CollapseItem>
        </Collapse>

        <ButtonContainer>
          <Button
            loading={isLoading}
            disabled={!selectedPanel}
            variant="primary"
            onClick={onConfirm}
          >
            Confirm
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </ButtonContainer>
      </Space>
    </Modal>
  );
};
