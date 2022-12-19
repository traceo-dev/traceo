import { EChartsOption } from "echarts";
import { IncidentStatusSearch, IncidentStatus } from "../../../../../types/incidents";
import { PieData } from "../../../../../types/statistics";
import { tooltipOptions } from "../../utils";

export const unresolvedColorPalette = [
    "#7F1D1D",
    "#711111",
    "#631616",
    "#541818",
    "#461A1A",
    "#381C1C",
    "#2A1E1E",
    "#1C2020",
    "#0E2222",
    "#002424"
];

export const resolvedColorPalette = [
    "#14432D",
    "#166534",
    "#15803D",
    "#16A34A",
    "#22C55E",
    "#4ADE80",
    "#86EFAC",
    "#BBF7D0",
    "#D4FCE7",
    "#F0FDF4"
];

export const inProgressColorPalette = [
    "#58205B",
    "#6B21A8",
    "#7E22CE",
    "#9333EA",
    "#A855F7",
    "#C084FC",
    "#D8B4FE",
    "#E9D5FF",
    "#F3E8FF",
    "#FAF5FF"
];

export const pieChartOptions = [
    {
        value: IncidentStatusSearch.ALL,
        label: "All"
    },
    {
        value: IncidentStatusSearch.UNRESOLVED,
        label: "Unresolved"
    },
    {
        value: IncidentStatusSearch.IN_PROGRESS,
        label: "In Progress"
    },
    {
        value: IncidentStatusSearch.RESOLVED,
        label: "Resolved"
    }
];

export const handleIncidentStatusPieColor: Record<
    Exclude<IncidentStatusSearch, "all">,
    string
> = {
    [IncidentStatusSearch.IN_PROGRESS]: "#6B21A8",
    [IncidentStatusSearch.RESOLVED]: "#14432D",
    [IncidentStatusSearch.UNRESOLVED]: "#7F1D1D"
};

export const handleColorPallete: Record<IncidentPieType, string[]> = {
    [IncidentStatus.UNRESOLVED]: unresolvedColorPalette,
    [IncidentStatus.RESOLVED]: resolvedColorPalette,
    [IncidentStatus.IN_PROGRESS]: inProgressColorPalette
};

export type IncidentPieType = Exclude<IncidentStatusSearch, "all">;

export const getPiePlotOptions = (type: IncidentStatusSearch, data: PieData[]): EChartsOption => {
    return {
        tooltip: {
            trigger: "item",
            backgroundColor: tooltipOptions.backgroundColor,
            borderColor: tooltipOptions.borderColor,
            textStyle: tooltipOptions.textStyle,
            position: "right"
        },
        series: [
            {
                name: type === IncidentStatusSearch.ALL ? "Incidents" : "Errors",
                data,
                type: "pie",
                radius: ["70%", "30%"],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: "center",
                    formatter: ({ value }) => `${value}`,
                    fontWeight: 15,
                    fontSize: 20
                },
                itemStyle: {
                    borderRadius: 8,
                    borderColor: "#181B1F",
                    borderWidth: 3
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: "normal",
                        color: "#ffffff"
                    }
                },
                color: handleColorPallete[type]
            }
        ]
    }
}