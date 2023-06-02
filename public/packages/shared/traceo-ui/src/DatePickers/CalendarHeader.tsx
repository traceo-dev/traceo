import { ClockCircleOutlined } from "@ant-design/icons";
import { Header } from "./styles";
import { Row } from "../Row";

interface Props {
  title: string;
}
export const CalendarHeader = ({ title }: Props) => (
  <Header>
    <Row gap="x-3">
      <ClockCircleOutlined />
      {title}
    </Row>
  </Header>
);
