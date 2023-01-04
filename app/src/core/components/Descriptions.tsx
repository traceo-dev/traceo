import { Typography, Button, Space, Radio } from "antd";
import { joinClasses } from "../../core/utils/classes";
import { FC, useState } from "react";
import { Input } from "core/ui-components/Input/Input";

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
      <Button onClick={() => setUpdateMode(true)} htmlType="submit" type="primary">
        Update
      </Button>
    );
  }

  return (
    <Space>
      <Button type="primary" onClick={() => onFinish()}>
        Save
      </Button>
      <Button type="primary" ghost onClick={() => setUpdateMode(false)}>
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
          <Typography.Text className={joinClasses("text-sm font-normal", className)}>
            {label}
          </Typography.Text>
        </td>
        <td className="w-32" />
        <td className="details-table-value" colSpan={2}>
          <Typography.Text className="text-sm font-normal">{children}</Typography.Text>
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
          <Typography.Text className="text-sm font-semibold">{label}</Typography.Text>
        </td>
        <td className="details-table-value" colSpan={2}>
          {updateMode ? (
            <Input
              defaultValue={children}
              onChange={(e) => setValue(e.currentTarget.value)}
              className="p-0"
            />
          ) : (
            <Typography.Text className="text-sm font-normal">{children}</Typography.Text>
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

interface DescriptionRadioRowProps {
  label: string;
  children: string | number | boolean | any;
  onUpdate?: (value: string | number | boolean | any) => void;
  options: { label: string; value: string | number | boolean }[];
  defaultValue: string | number | boolean | any;
  editable?: boolean;
}
export const DescriptionRadioRow: FC<DescriptionRadioRowProps> = ({
  label,
  children,
  onUpdate,
  options = [],
  defaultValue,
  editable = true
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
          <Typography.Text className="text-sm font-semibold">{label}</Typography.Text>
        </td>
        <td className="details-table-value" colSpan={2}>
          {updateMode ? (
            <Radio.Group
              options={options}
              onChange={(val) => setValue(val.target.value)}
              defaultValue={defaultValue}
              optionType="button"
              buttonStyle="solid"
            />
          ) : (
            <Typography.Text className="text-sm font-normal">{children}</Typography.Text>
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
