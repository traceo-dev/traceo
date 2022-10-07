import { Collapse } from "antd";
import { FC } from "react";
import { joinClasses } from "../../core/utils/classes";

const { Panel } = Collapse;
interface Props {
  label: string | JSX.Element;
  className?: string;
}
export const CollapsedDetails: FC<Props> = ({ label, children, className }) => {
  return (
    <Collapse
      defaultActiveKey={["1"]}
      ghost
      expandIconPosition="end"
      className={joinClasses(
        "collapsed-details-header collapsed-details-body",
        className
      )}
    >
      <Panel header={label} key="1">
        {children}
      </Panel>
    </Collapse>
  );
};
