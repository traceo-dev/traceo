import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { Card, FieldLabel, Typography } from "@traceo/ui";

export const PlatformSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <Card title="Platform" className="h-auto">
      <FieldLabel label="Version">
        <Typography>{incident?.platform.version}</Typography>
      </FieldLabel>
      <FieldLabel label="Platform">
        <Typography>{incident?.platform.platform}</Typography>
      </FieldLabel>
      <FieldLabel label="Arch">
        <Typography>{incident?.platform.arch}</Typography>
      </FieldLabel>
      <FieldLabel label="Release">
        <Typography>{incident?.platform.release}</Typography>
      </FieldLabel>
    </Card>
  );
};
