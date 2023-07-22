import {
  PanelConfiguration,
  METRIC_UNIT,
  VISUALIZATION_TYPE,
  DashboardPanel
} from "@traceo/types";

const basePanelConfigs: PanelConfiguration = {
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

export const initialDashboardPanels: DashboardPanel[] = [
  {
    title: "",
    type: "welcome",
    description: undefined,
    gridPosition: { x: 0, y: 0, h: 8, w: 24 },
    config: {
      ...basePanelConfigs,
      visualization: VISUALIZATION_TYPE.TEXT,
      text: {
        size: 0,
        weight: 0,
        color: "",
        value: "# Welcome 👋\n\nYou don't know how to start integrations in Traceo SDK? That's no problem, read the [README](https://github.com/traceo-dev/traceo-javascript) for your target SDK for this project and follow the instructions. It shouldn't take more than 5 minutes!\n\nIn case of problems with the integration or with the use of the Traceo platform, please create a ticket [here](https://github.com/traceo-dev/traceo/issues/new).\n\nRemember that every comment or idea to improve the application is valuable. Therefore, we ask you to provide [feedback](https://github.com/traceo-dev/traceo/discussions/new?category=ideas).\n\n\n\n"
      }
    }
  },
  {
    title: "Today's events",
    type: "todays_events",
    description: undefined,
    gridPosition: {
      w: 20,
      h: 8,
      x: 0,
      y: 0
    },
    config: {
      ...basePanelConfigs,
      visualization: VISUALIZATION_TYPE.TIME_SERIES,
      series: [
        {
          datasource: {
            field: "events_overview_plot",
          },
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
          unit: METRIC_UNIT.NONE
        }
      ]
    }
  },
  {
    title: "Last month events",
    type: "overview_events",
    description: undefined,
    gridPosition: {
      w: 24,
      h: 10,
      x: 0,
      y: 8
    },
    config: {
      ...basePanelConfigs,
      visualization: VISUALIZATION_TYPE.TIME_SERIES,
      series: [
        {
          datasource: {
            field: "events_overview_plot",
          },
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
          unit: METRIC_UNIT.NONE
        }
      ]
    }
  },
  {
    title: "Last seen",
    description: "Time of today's last event.",
    type: "last_event_at",
    gridPosition: {
      w: 4,
      h: 4,
      x: 20,
      y: 4
    },
    config: {
      ...basePanelConfigs,
      text: {
        weight: 500,
        size: 32,
        color: "#ccccdc"
      },
      visualization: VISUALIZATION_TYPE.STAT
    }
  },
  {
    title: "Events count",
    description: "Number of events captured since midnight.",
    type: "today_events_count",
    gridPosition: {
      w: 4,
      h: 4,
      x: 20,
      y: 0
    },
    config: {
      ...basePanelConfigs,
      text: {
        weight: 500,
        size: 44,
        color: "#ccccdc"
      },
      visualization: VISUALIZATION_TYPE.STAT
    }
  }
];
