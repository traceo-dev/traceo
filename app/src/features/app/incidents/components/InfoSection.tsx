import { Card } from "core/ui-components/Card";
import { FieldLabel } from "core/ui-components/Form/FieldLabel";
import { Select } from "core/ui-components/Select";
import { useSelector } from "react-redux";
import { StoreState } from "types/store";
import { useEffect } from "react";
import { dispatch } from "store/store";
import { loadMembers } from "features/app/settings/state/members/actions";
import { updateIncident } from "../state/actions";
import dateUtils from "core/utils/date";
import { Typography } from "core/ui-components/Typography";
import { assignOptions, statusOptions } from "./utils";

export const InfoSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);
  const { members } = useSelector((state: StoreState) => state.members);

  useEffect(() => {
    dispatch(loadMembers());
  }, []);

  const onChangeIncidentProps = (update: { [key: string]: any }) => {
    dispatch(updateIncident(update));
  };

  return (
    <Card title="Info" className="h-min">
      <FieldLabel label="Status">
        <Select
          isSearchable={false}
          onChange={(opt) =>
            onChangeIncidentProps({
              status: opt?.value
            })
          }
          defaultValue={incident.status}
          options={statusOptions}
        />
      </FieldLabel>
      <FieldLabel label="Assign">
        <Select
          onChange={(opt) =>
            onChangeIncidentProps({
              assignedId: opt?.value
            })
          }
          defaultValue={incident?.assigned?.id}
          options={assignOptions(members)}
        />
      </FieldLabel>
      <FieldLabel label="Catched at">
        <Typography size="sm" weight="normal">
          {dateUtils.formatDate(incident?.createdAt, "DD MMM YYYY, HH:mm")}
        </Typography>
      </FieldLabel>
      <FieldLabel label="Last error">
        <Typography size="sm" weight="normal">
          {dateUtils.formatDate(incident?.lastError, "DD MMM YYYY, HH:mm")}
        </Typography>
      </FieldLabel>
      {/* <FieldLabel label="Last updated">
        <Typography size="sm" weight="normal">
        </Typography>
      </FieldLabel> */}
      <FieldLabel label="Number of errors">
        <Typography weight="normal">{incident?.errorsCount}</Typography>
      </FieldLabel>
    </Card>
  );
};
