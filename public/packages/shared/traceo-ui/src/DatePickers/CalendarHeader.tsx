import { ClockCircleOutlined } from "@ant-design/icons";
import { Header } from "./styles";

interface Props {
  title: string;
}
export const CalendarHeader = ({ title }: Props) => (
  <Header>
    <div className="flex flex-row gap-x-3">
      <ClockCircleOutlined />
      {title}
    </div>
  </Header>
);
