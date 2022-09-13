import { Typography, Input, Button, Space, Select, Radio } from "antd";
import { FC, useState } from "react";

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
  return (
    <td className="action">
      {!updateMode ? (
        <Button onClick={() => setUpdateMode(true)} htmlType="submit" type="primary">
          Update
        </Button>
      ) : (
        <Space>
          <Button type="primary" onClick={() => onFinish()}>
            Save
          </Button>
          <Button type="primary" ghost onClick={() => setUpdateMode(false)}>
            Cancel
          </Button>
        </Space>
      )}
    </td>
  );
};

interface DescriptionInputRowProps {
  label: string;
  children: string | number;
  onUpdate?: (value: string) => void;
}

export const DescriptionInputRow: FC<DescriptionInputRowProps> = ({
  label,
  children,
  onUpdate
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
            <Input defaultValue={children} onChange={(e) => setValue(e.target.value)} />
          ) : (
            <Typography.Text className="text-sm font-normal">{children}</Typography.Text>
          )}
        </td>
        <UpdateButtons
          onFinish={onFinish}
          setUpdateMode={setUpdateMode}
          updateMode={updateMode}
        />
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
}
export const DescriptionRadioRow: FC<DescriptionRadioRowProps> = ({
  label,
  children,
  onUpdate,
  options = [],
  defaultValue
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
        <UpdateButtons
          onFinish={onFinish}
          setUpdateMode={setUpdateMode}
          updateMode={updateMode}
        />
      </tr>
    </>
  );
};
