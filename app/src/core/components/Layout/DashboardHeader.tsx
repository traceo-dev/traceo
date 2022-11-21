import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

export const DashboardHeader = () => {
  return (
    <>
      <div className="flex h-12 max-h-12 items-center justify-end py-2 px-5 header-border-bottom bg-primary">
        <Button
          icon={<QuestionCircleOutlined />}
          className="border rounded hover:bg-secondary outline-none"
        >
          Help
        </Button>
      </div>
      <style>{`
        .header-border-bottom {
            border-bottom: 1px solid rgba(204, 204, 220, 0.07)
        }
      `}</style>
    </>
  );
};
