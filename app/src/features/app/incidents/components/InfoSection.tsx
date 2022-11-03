import dateUtils from "../../../../core/utils/date";
import { PagePanel } from "../../../../core/components/PagePanel";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../types/store";
import {
  DescriptionInputRow,
  Descriptions
} from "../../../../core/components/Descriptions";

export const InfoSection = () => {
  const { incident } = useSelector((state: StoreState) => state.incident);

  return (
    <>
      <PagePanel title="Info">
        <Descriptions>
          <DescriptionInputRow label="Catched at" editable={false}>
            {dateUtils.formatDateTime(incident?.createdAt)}
          </DescriptionInputRow>
          <DescriptionInputRow label="Last error" editable={false}>
            {dateUtils.formatDateTime(incident?.lastError)}
          </DescriptionInputRow>
          <DescriptionInputRow label="Number of errors" editable={false}>
            {incident?.errorsCount}
          </DescriptionInputRow>
        </Descriptions>
      </PagePanel>
    </>
  );
};
