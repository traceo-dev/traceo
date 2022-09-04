import { Radio, Space, Typography } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CollapsedDetails } from "src/core/components/CollapsedDetails";
import { PagePanel } from "src/core/components/PagePanel";
import { StoreState } from "src/types/store";
import { CodeTraces } from "./CodeTraces";

export const StacktraceSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  const [isInternal, setInternal] = useState<boolean>(false);
  const isTraces = incident?.traces?.length > 0;

  return (
    <>
      {isTraces && (
        <PagePanel>
          <CollapsedDetails label="Stacktrace">
            <Space className="w-full pt-8 gap-0" direction="vertical">
              <Typography.Text className="text-xl font-semibold">
                {incident?.type}
              </Typography.Text>
              <Typography.Text className="text-md">{incident?.message}</Typography.Text>
            </Space>
            <Space className="float-right pt-3">
              <Radio.Group
                className="float-right"
                value={isInternal}
                onChange={(val) => {
                  setInternal(val.target.value);
                }}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value={false}>All</Radio.Button>
                <Radio.Button value={true}>Internal</Radio.Button>
              </Radio.Group>
            </Space>
            <Space direction="vertical" className="pt-5">
              <CodeTraces incident={incident} isInternal={isInternal} />
            </Space>
          </CollapsedDetails>
        </PagePanel>
      )}
    </>
  );
};
