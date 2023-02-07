import { Popover } from "../Popover";
import { HexColorPicker } from "react-colorful";
import { useEffect, useState } from "react";
import { BasePlacement } from "@popperjs/core";
import styled from "styled-components";

interface Props {
  color: string;
  onChange: (color: string) => void;
  children: JSX.Element;
  placement?: BasePlacement;
}
export const ColorPicker = ({
  color,
  onChange,
  children,
  placement = "bottom",
}: Props) => {
  const [newColor, setColor] = useState<string>(color);

  useEffect(() => {
    onChange(newColor);
  }, [newColor]);

  const pickerContent = () => (
    <div className="flex flex-col p-1">
      <ColorPickerWrapper>
        <HexColorPicker color={newColor} onChange={setColor} />
      </ColorPickerWrapper>
      <div
        className="mt-2 h-7 w-full rounded-sm"
        style={{ backgroundColor: newColor }}
      />
    </div>
  );

  return (
    <Popover placement={placement} showArrow={false} content={pickerContent()}>
      {children}
    </Popover>
  );
};

const ColorPickerWrapper = styled.div`
  .react-colorful__pointer {
    width: 14px !important;
    height: 14px !important;
  }
`;
