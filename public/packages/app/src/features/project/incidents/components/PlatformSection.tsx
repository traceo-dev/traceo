import { StoreState } from "../../../../store/types";
import { Card, FieldLabel, Typography } from "@traceo/ui";
import { useSelector } from "react-redux";

export const PlatformSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <Card title="Platform" className="h-auto">
      {Object.entries(incident?.platform || {}).map(([key, value]) => (
        <FieldLabel label={key}>
          <Typography>{value}</Typography>
        </FieldLabel>
      ))}
    </Card>
  );
};
