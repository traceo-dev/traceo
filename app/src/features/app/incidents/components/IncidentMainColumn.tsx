import { BugOutlined, MessageOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { FC } from "react";
import { Incident } from "../../../../types/incidents";
import { joinClasses } from "../../../../core/utils/classes";
import dateUtils from "../../../../core/utils/date";
import { wrapIncidentMessage } from "../../../../core/utils/stringUtils";
import { IncidentStatusTag } from "../../../../core/components/IncidentStatusTag";

interface Props {
  incident: Incident;
}
export const IncidentMainColumn: FC<Props> = ({ incident }) => {
  return (
    <Space direction="vertical" style={{ rowGap: 0 }}>
      <Typography.Link
        className={joinClasses("font-semibold", "text-lg", "text-primary")}
      >
        {incident?.type}
      </Typography.Link>
      <Typography className="text-xs">
        {wrapIncidentMessage(incident?.message)}
      </Typography>
      <Space className="pt-2">
        <IncidentStatusTag status={incident?.status} />|
        <Typography className="text-xs font-semibold text-primary">
          Last: {dateUtils.fromNow(incident?.lastOccur)}
        </Typography>
        |
        <Typography className="text-xs font-semibold text-primary">
          <BugOutlined className="pr-3" />
          {incident?.occuredCount}
        </Typography>
        |
        <Typography className="text-xs font-semibold text-primary">
          <MessageOutlined className="pr-3" />
          {incident?.commentsCount || 0}
        </Typography>
      </Space>
    </Space>
  );
};
