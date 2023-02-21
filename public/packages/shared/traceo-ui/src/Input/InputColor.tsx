import { ColorPicker } from "../ColorPicker";
import { Input } from "./Input";
import { BasePlacement } from "@popperjs/core";

interface Props {
  color: string;
  onChange: (color: string) => void;
  pickerPlacement?: BasePlacement;
}
export const InputColor = ({ color, onChange, pickerPlacement = "bottom" }: Props) => {
  return (
    <Input
      value={color}
      onChange={(e) => onChange(e.target["value"])}
      suffix={
        <ColorPicker placement={pickerPlacement} color={color} onChange={onChange}>
          <div
            className="rounded-full w-5 h-5 cursor-pointer"
            style={{ backgroundColor: color }}
          />
        </ColorPicker>
      }
    />
  );
};
