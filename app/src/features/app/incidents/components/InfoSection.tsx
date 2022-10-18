import { Space } from "antd";
import { RowDetail } from "../../../../core/components/RowDetail";
import dateUtils from "../../../../core/utils/date";
import { PagePanel } from "../../../../core/components/PagePanel";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";

export const InfoSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <>
      <PagePanel title="Info">
        <Space className="w-2/3">
          <RowDetail
            label={"Catched at"}
            value={dateUtils.formatDateTime(incident?.createdAt)}
          />
          <RowDetail
            label={"Last error"}
            value={dateUtils.formatDateTime(incident?.lastOccur)}
            className="pl-24"
          />
        </Space>

        <Space className="w-2/3">
          <RowDetail label={"Number of errors"} value={incident?.occuredCount} />
        </Space>
      </PagePanel>
    </>
  );
};
