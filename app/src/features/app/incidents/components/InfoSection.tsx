import dateUtils from "../../../../core/utils/date";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import {
  DescriptionInputRow,
  Descriptions
} from "../../../../core/components/Descriptions";
import { Card } from "core/ui-components/Card/Card";

export const InfoSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <>
      <Card title="Info">
        <Descriptions>
          <DescriptionInputRow label="Catched at" editable={false}>
            {dateUtils.formatDate(incident?.createdAt, "DD MMM YYYY, HH:mm")}
          </DescriptionInputRow>
          <DescriptionInputRow label="Last error" editable={false}>
            {dateUtils.formatDate(incident?.lastError, "DD MMM YYYY, HH:mm")}
          </DescriptionInputRow>
          <DescriptionInputRow label="Number of errors" editable={false}>
            {incident?.errorsCount}
          </DescriptionInputRow>
        </Descriptions>
      </Card>
    </>
  );
};
