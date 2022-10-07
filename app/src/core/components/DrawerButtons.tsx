import { Button } from "antd";

export const DrawerButtons = ({
  onClose,
  onFinish,
  loading = false,
  okLabel = "Confirm"
}) => {
  return (
    <>
      <Button onClick={() => onClose()} ghost className="w-1/2">
        Cancel
      </Button>
      <Button
        loading={loading}
        onClick={() => onFinish()}
        type="primary"
        className="w-1/2"
      >
        {okLabel}
      </Button>
    </>
  );
};
