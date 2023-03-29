import dateUtils from "../../../../core/utils/date";
import { useAppDispatch } from "../../../../store";
import { loadMembers } from "../../settings/state/members/actions";
import { updateIncident } from "../state/actions";
import { assignOptions, statusOptions } from "./utils";
import { StoreState } from "@store/types";
import { Card, FieldLabel, Select, Typography } from "@traceo/ui";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const InfoSection = () => {
  const dispatch = useAppDispatch();
  const { incident } = useSelector((state: StoreState) => state.incident);
  const { members } = useSelector((state: StoreState) => state.members);

  useEffect(() => {
    dispatch(loadMembers());
  }, []);

  const onChangeIncidentProps = (update: { [key: string]: any }) => {
    dispatch(updateIncident(update));
  };

  return (
    <Card title="Info" className="h-auto">
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
      <FieldLabel label="First seen">
        <Typography size="sm" weight="normal">
          {dateUtils.formatDate(incident?.createdAt, "DD MMM YYYY, HH:mm")}
        </Typography>
      </FieldLabel>
      <FieldLabel label="Last seen">
        <Typography size="sm" weight="normal">
          {dateUtils.formatDate(incident?.lastEventAt, "DD MMM YYYY, HH:mm")}
        </Typography>
      </FieldLabel>
      <FieldLabel label="Total errors">
        <Typography weight="normal">{incident?.eventsCount}</Typography>
      </FieldLabel>
    </Card>
  );
};
