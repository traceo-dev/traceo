export default {};

// import dateUtils from "../../../utils/date";
// import { FC, useEffect } from "react";
// import { BaseChart } from "../BaseChart";
// import { BaseXAxis } from "../BaseXAxis";
// import { BaseYAxis } from "../BaseYAxis";
// import { BaseTooltip } from "../BaseTooltip";
// import { SearchOutlined } from "@ant-design/icons";
// import { useReactQuery } from "../../../../core/hooks/useReactQuery";

// interface Props {
//   id: string;
// }
// const PLOT_COLOR = "#04785A";
// const IncidentListOverviewChart: FC<Props> = ({ id }) => {
//   const { data, isLoading, refetch } = useReactQuery({
//     queryKey: [`grouped_events_${id}`],
//     url: `/api/event/project/${id}/grouped`
//   });

//   console.log("ov: ", data)
//   useEffect(() => {
//     refetch();
//   }, [id]);

//   const formatter = (v: unknown) => dateUtils.formatDate(Number(v), "MMM D, YYYY");

//   if (!isLoading && (!data || data.length === 0)) {
//     return (
//       <div className="w-full text-center flex flex-col text-primary">
//         <SearchOutlined className="text-lg" />
//         <span className="text-xs font-semibold">Data not found</span>
//       </div>
//     );
//   }

//   return (
//     <BaseChart
//       height="70px"
//       isLoading={isLoading}
//       dataset={{
//         source: data || []
//       }}
//       series={{
//         name: "Errors",
//         type: "bar",
//         color: PLOT_COLOR,
//         itemStyle: {
//           borderColor: PLOT_COLOR,
//           borderWidth: 2,
//           borderRadius: 0
//         },
//         barWidth: 10,
//         barGap: "5%"
//       }}
//       xAxis={BaseXAxis({
//         pointerFormatter: formatter,
//         show: false
//       })}
//       yAxis={BaseYAxis({
//         axisLabel: {
//           showMinLabel: false,
//           hideOverlap: true,
//           color: "#CCCCDC",
//           fontSize: 10
//         },
//         // Props to show only max value on yAxis
//         max: (e) => {
//           return e.max;
//         },
//         min: 0,
//         interval: 99999
//       })}
//       tooltip={BaseTooltip({
//         pointer: "shadow"
//       })}
//       grid={{
//         left: "25px",
//         right: "5px",
//         top: "10px",
//         bottom: "5px"
//       }}
//     />
//   );
// };

// export default IncidentListOverviewChart;
