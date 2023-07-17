type ChartTheme = {
  label: {
    color: string;
    size: number;
  };
  splitLine: {
    color: string;
    width: number;
  };
  axisLine: {
    color: string;
  };
  font: {
    family: string;
  };
  legend: {
    color: string;
  };
  item: {
    color: string;
  };
  tooltip: {
    color: {
      bg: string;
      border: string;
      text: string;
      line: string;
    };
    font: string;
  };
  logs: {
    barColor: string;
  };
  incidents: {
    timeline: {
      color: string;
      barWidth: number;
      areaOpacity: number;
    };
    serie: {
      color: string;
      lineColor: string;
      areaColors: string[];
      markAreaColor: string;
    };
  };
};

const chart: ChartTheme = {
  label: {
    color: "#CCCCDC",
    size: 11
  },
  splitLine: {
    color: "#272A30",
    width: 1
  },
  axisLine: {
    color: "272A30"
  },
  font: {
    family: "'Rubik', 'Avenir Next', sans-serif"
  },
  legend: {
    color: "#CCCCDC"
  },
  item: {
    color: "#E24D42"
  },
  tooltip: {
    color: {
      bg: "#111217",
      border: "#111217",
      line: "gray",
      text: "#CCCCDC"
    },
    font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
  },
  logs: {
    barColor: "#3B82F5"
  },
  incidents: {
    timeline: {
      color: "#04785A",
      barWidth: 10,
      areaOpacity: 0.4
    },
    serie: {
      areaColors: ["#641D2C", "#6B403A"],
      color: "#E24D42",
      lineColor: "#E24D42",
      markAreaColor: "#111217"
    }
  }
};

export const theme = {
  chart
};
