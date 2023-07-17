import {
  DeepPartial,
  DASHBOARD_PANEL_TYPE,
  DashboardPanel,
  METRIC_UNIT,
  PanelConfiguration,
  VISUALIZATION_TYPE,
  UplotDataType
} from "@traceo/types";
import { randomHexColor } from "../../../core/utils/colors";
import { PanelProps } from "./components/Panels/types";
import { PlotPanel } from "./components/Panels/PlotPanel";
import { StatPanel } from "./components/Panels/StatPanel";
import { TextPanel } from "./components/Panels/TextPanel";

export type QueryResponseType = {
  options: DashboardPanel;
  datasource: UplotDataType;
};

export const GRID_BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
export const GRID_MARGIN = [4, 4];
export const GRID_COLS = { lg: 24, md: 12, sm: 6, xs: 4, xxs: 2 };
export const GRID_ROW_HEIGHT = 30;
export const GRID_PADDING = [0, 0];
export const GRID_BASE_PANEL_HEIGHT = 92;
export const GRID_MIN_WIDTH = 3;
export const GRID_MIN_HEIGHT = 3;

// get component based on selected visualization types
export const getVisualizationComponent = (
  visualization: VISUALIZATION_TYPE,
  props: PanelProps
) => {
  switch (visualization) {
    case VISUALIZATION_TYPE.TIME_SERIES:
    case VISUALIZATION_TYPE.HISTOGRAM:
      return <PlotPanel {...props} />;
    case VISUALIZATION_TYPE.STAT:
      return <StatPanel {...props} />;
    case VISUALIZATION_TYPE.TEXT:
      return <TextPanel {...props} />;
    default:
      return null;
  }
};

// parse grid-layout height to px
export const calculatePlotHeight = (h: number): number => {
  return h * (GRID_ROW_HEIGHT + GRID_MARGIN[0]) - GRID_BASE_PANEL_HEIGHT;
};

const panelConfig: PanelConfiguration = {
  legend: {
    show: false,
    orient: "horizontal"
  },
  line: {
    marker: {
      show: false
    }
  },
  tooltip: {
    show: true,
    position: ""
  },
  axis: {
    showX: true,
    showY: true,
    showGridLines: true,
    showFloatLabels: false
  },
  stack: {
    show: false,
    strategy: undefined
  },
  histogram: {
    bucket: {
      size: 5,
      offset: 0
    },
    min: 1,
    max: undefined
  },
  unit: METRIC_UNIT.NONE,
  visualization: VISUALIZATION_TYPE.TIME_SERIES,
  series: [],
  text: {
    size: 0,
    weight: 0,
    color: "",
    value: ""
  }
};

export const initialCustomPanelProps: DashboardPanel = {
  title: "Panel title",
  description: "Panel description",
  type: "custom",
  gridPosition: {
    w: 12,
    h: 8,
    x: 0,
    y: 0
  },
  config: {
    ...panelConfig,
    visualization: VISUALIZATION_TYPE.TIME_SERIES,
    series: [
      {
        name: "New serie",
        description: undefined,
        config: {
          area: {
            opacity: 50,
            show: false
          },
          barWidth: 50,
          color: randomHexColor(),
          lineWidth: 1,
          type: "line"
        },
        field: undefined,
        unit: METRIC_UNIT.NONE
      }
    ]
  }
};

export const dashboardPanelOptions: Record<DASHBOARD_PANEL_TYPE, DeepPartial<DashboardPanel>> = {
  custom: initialCustomPanelProps,
  todays_events: {
    title: "Today's events",
    type: "todays_events",
    gridPosition: {
      w: 20,
      h: 8,
      x: 0,
      y: 0
    },
    config: {
      ...panelConfig,
      visualization: VISUALIZATION_TYPE.TIME_SERIES,
      series: [
        {
          config: {
            area: {
              opacity: 100,
              show: true
            },
            barWidth: 90,
            color: "#9a2e19",
            lineWidth: 1,
            type: "bar"
          },
          name: "Events",
          description: undefined,
          field: "events_overview_plot",
          unit: METRIC_UNIT.NONE
        }
      ]
    }
  },
  overview_events: {
    title: "Last month events",
    type: "overview_events",
    gridPosition: {
      w: 24,
      h: 10,
      x: 0,
      y: 0
    },
    config: {
      ...panelConfig,
      visualization: VISUALIZATION_TYPE.TIME_SERIES,
      series: [
        {
          config: {
            area: {
              opacity: 50,
              show: true
            },
            barWidth: 90,
            color: "#9a2e19",
            lineWidth: 1,
            type: "bar"
          },
          name: "Events",
          description: undefined,
          field: "events_overview_plot",
          unit: METRIC_UNIT.NONE
        }
      ]
    }
  },
  recent_events: undefined,
  last_event_at: {
    title: "Last seen",
    description: "Time of today's last event.",
    type: "last_event_at",
    gridPosition: {
      w: 4,
      h: 4,
      x: 0,
      y: 0
    },
    config: {
      ...panelConfig,
      text: {
        weight: 500,
        size: 32,
        color: "#ccccdc"
      },
      visualization: VISUALIZATION_TYPE.STAT
    }
  },
  today_events_count: {
    title: "Events count",
    description: "Number of events captured since midnight.",
    type: "today_events_count",
    gridPosition: {
      w: 4,
      h: 4,
      x: 0,
      y: 0
    },
    config: {
      ...panelConfig,
      text: {
        weight: 500,
        size: 44,
        color: "#ccccdc"
      },
      visualization: VISUALIZATION_TYPE.STAT
    }
  },
  logs_plot: undefined,
  logs_table: undefined
};

export const validate = (options: DashboardPanel) => {
  const errors = [];
  const visualization = options.config.visualization;
  const canHaveNoSeries = [VISUALIZATION_TYPE.TEXT, VISUALIZATION_TYPE.STAT].includes(
    visualization
  );
  const canHaveNoTitle = [VISUALIZATION_TYPE.TEXT].includes(visualization);

  if (!options.title && !canHaveNoTitle) {
    errors.push("Metric name is required.");
  }

  const series = options.config.series;
  if (series.length === 0) {
    errors.push("You have to add at least one serie to this panel.");
  }

  const missingName = series.find((serie) => !serie?.name);
  if (missingName) {
    errors.push("Your serie does not have a required name value.");
  }

  const missingField = series.find((serie) => !serie?.field);
  if (missingField && !canHaveNoSeries) {
    errors.push("Your serie does not have a required field value.");
  }

  return errors;
};
