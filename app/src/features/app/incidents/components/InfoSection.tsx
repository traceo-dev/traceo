import { Space } from "antd";
import { RowDetail } from "src/core/components/RowDetail";
import dateUtils from "src/core/utils/date";
import { CollapsedDetails } from "src/core/components/CollapsedDetails";
import { PagePanel } from "src/core/components/PagePanel";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";

export const InfoSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <>
      <PagePanel>
        <CollapsedDetails label="Info">
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
            {/* <RowDetail
              label={"Release"}
              value={
                <Typography.Link
                  onClick={() =>
                    navigate(
                      `/app/${application.id}/releases/${incident?.release?.id}/details`
                    )
                  }
                >
                  {incident?.release?.name}
                </Typography.Link>
              }
              className="pl-24"
            /> */}
          </Space>
        </CollapsedDetails>
      </PagePanel>
    </>
  );
};
