import {
  BarChartOutlined,
  ClockCircleOutlined,
  NumberOutlined,
  PlusSquareOutlined,
  TableOutlined
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
import { ChoosePanelGrid } from "./ChoosePanelGrid";
import { DASHBOARD_PANEL_TYPE } from "@traceo/types";

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
    label: "Overview events",
    value: "overview_events",
    icon: <BarChartOutlined />
  },
  {
    label: "Recent events",
    value: "recent_events",
    icon: <TableOutlined />
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

const logsPanels: SelectOptionProps[] = [
  {
    label: "Logs plot",
    value: "logs_plot",
    icon: <BarChartOutlined />
  },
  {
    label: "Logs table",
    value: "logs_table",
    icon: <TableOutlined />
  }
];

const customPanels: SelectOptionProps[] = [
  {
    label: "Custom",
    value: "custom",
    icon: <PlusSquareOutlined />
  }
];

export const SelectPanelModal: FC<Props> = ({ isOpen, onCancel }) => {
  const { id, did } = useParams();
  const navigate = useNavigate();
  const [selectedPanel, setSelectedPanel] = useState<DASHBOARD_PANEL_TYPE>(null);

  const onConfirm = () => {
    if (selectedPanel === "custom") {
      navigate({
        pathname: `/project/${id}/dashboard/${did}/panel-create`,
        search: `?type=${selectedPanel}`
      });
    } else {
      // TODO: create other types of panels here
    }

    onCancel();
  };

  return (
    <Modal size="xl" title="Select dashboard panel" open={isOpen} onCancel={onCancel}>
      <Space direction="vertical" className="pt-0 px-4 w-full h-full justify-between text-center">
        <Collapse ghost collapseIconPosition="start" defaultActiveKey="events_section">
          <CollapseItem
            panelKey="events_section"
            header={
              <Col className="text-start">
                <Typography weight="semibold">Events</Typography>
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
            panelKey="logs_section"
            header={
              <Col className="text-start">
                <Typography weight="semibold">Logs</Typography>
                <Typography size="xs">Visualization of logs sent for this project.</Typography>
              </Col>
            }
          >
            <ChoosePanelGrid
              options={logsPanels}
              onSelect={(v) => setSelectedPanel(v)}
              selected={selectedPanel}
            />
          </CollapseItem>
          <CollapseItem
            panelKey="custom_section"
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
          <Button disabled={!selectedPanel} variant="primary" onClick={onConfirm}>
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
