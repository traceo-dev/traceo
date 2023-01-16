import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import { Card } from "core/ui-components/Card";
import { FieldLabel } from "core/ui-components/Form/FieldLabel";
import { Typography } from "core/ui-components/Typography";

export const PlatformSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <Card title="Platform" className="h-min">
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
