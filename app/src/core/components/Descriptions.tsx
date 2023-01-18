import { FC, useState } from "react";
import { Input } from "core/ui-components/Input";
import { Button } from "core/ui-components/Button";
import { Typography } from "core/ui-components/Typography";
import { Space } from "core/ui-components/Space";

export const Descriptions = ({ children }) => {
  return (
    <>
      <table className="details-table">
        <tbody>{children}</tbody>
      </table>
      <style>{`
        .action {
          float: right;
        }
      `}</style>
    </>
  );
};

interface UpdateButtonsProps {
  updateMode: boolean;
  setUpdateMode: (val: boolean) => void;
  onFinish: () => void;
}
const UpdateButtons: FC<UpdateButtonsProps> = ({
  onFinish,
  setUpdateMode,
  updateMode
}) => {
  if (!updateMode) {
    return (
      <Button onClick={() => setUpdateMode(true)} type="submit">
        Update
      </Button>
    );
  }

  return (
    <Space>
      <Button onClick={() => onFinish()}>Save</Button>
      <Button variant="ghost" onClick={() => setUpdateMode(false)}>
        Cancel
      </Button>
    </Space>
  );
};

interface DescriptionRowProps {
  label: string;
  className?: string;
}
export const DescriptionRow: FC<DescriptionRowProps> = ({
  label,
  className,
  children
}) => {
  return (
    <>
      <tr>
        <td className="details-table-label">
          <span className={className}>{label}</span>
        </td>
        <td className="w-32" />
        <td className="details-table-value" colSpan={2}>
          <span>{children}</span>
        </td>
      </tr>
    </>
  );
};

interface DescriptionInputRowProps {
  label: string;
  children: any | JSX.Element;
  onUpdate?: (value: string) => void;
  editable?: boolean;
}

export const DescriptionInputRow: FC<DescriptionInputRowProps> = ({
  label,
  children,
  onUpdate,
  editable = false
}) => {
  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const [value, setValue] = useState<string>();

  const onFinish = () => {
    onUpdate(value);
    setUpdateMode(false);
  };

  return (
    <>
      <tr>
        <td className="details-table-label">
          <Typography weight="semibold">{label}</Typography>
        </td>
        <td className="details-table-value" colSpan={2}>
          {updateMode ? (
            <Input
              defaultValue={children}
              onChange={(e) => setValue(e.currentTarget.value)}
              className="p-0"
            />
          ) : (
            <Typography>{children}</Typography>
          )}
        </td>
        <td className="action">
          {editable && (
            <UpdateButtons
              onFinish={onFinish}
              setUpdateMode={setUpdateMode}
              updateMode={updateMode}
            />
          )}
        </td>
      </tr>
    </>
  );
};
