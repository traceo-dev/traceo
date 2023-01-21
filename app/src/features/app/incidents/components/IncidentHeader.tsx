import { ArrowLeftOutlined, SyncOutlined } from "@ant-design/icons";
import { FC } from "react";
import { Incident } from "../../../../types/incidents";
import { notify } from "../../../../core/utils/notify";
import { useNavigate } from "react-router-dom";
import { Typography } from "core/ui-components/Typography";
import { Tooltip } from "core/ui-components/Tooltip";
import { Space } from "core/ui-components/Space";
import { IncidentStatusTag } from "core/components/IncidentStatusTag";
import { PageHeader } from "core/ui-components/PageHeader";

interface Props {
  incident: Incident;
  onExecute: () => void;
}
export const IncidentHeader: FC<Props> = ({ incident, onExecute }) => {
  const navigate = useNavigate();

  const refresh = () => {
    onExecute();
    notify.success("Refreshed");
  };

  return (
    <PageHeader
      title={
        <Space direction="vertical" className="gap-0 w-full">
          <Space
            className="text-2xs cursor-pointer font-semibold py-0 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftOutlined />
            <Typography size="xxs" weight="semibold" className="uppercase">
              incidents
            </Typography>
            <IncidentStatusTag className="ml-3" status={incident.status} />
          </Space>
          <div className="flex flex-col gap-2 pt-2 pb-5">
            <Typography size="xxl" weight="semibold">
              {incident?.type}
            </Typography>
            <Typography>{incident?.message}</Typography>
          </div>
        </Space>
      }
      suffix={
        <Tooltip title="Refresh" placement="top">
          <SyncOutlined onClick={refresh} className="text-xs cursor-pointer" />
        </Tooltip>
      }
    />
  );
};
