import { Button, Space } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DescriptionInputRow, Descriptions } from "src/core/components/Descriptions";
import { DetailsSection } from "src/core/components/DetailsSection";
import PageHeader from "src/core/components/PageHeader";
import api from "src/core/lib/api";
import { notify } from "src/core/utils/notify";
import { slugifyForUrl } from "src/core/utils/stringUtils";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";
import { loadServerApplication } from "../../state/applications/actions";

export const ApplicationInformation = () => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.serverApplications);

  const onUpdate = async (name: string) => {
    try {
      await api.patch("/api/application", {
        id: application.id,
        name
      });
      dispatch(loadServerApplication(application.id));
      notify.success("Application updated.");
    } catch (error) {
      notify.error("Error. Please try again later.");
    }
  };

  const OperationButtons = () => {
    return (
      <Space className="w-full justify-end">
        <Button
          onClick={() =>
            navigate(`/app/${application.id}/${slugifyForUrl(application.name)}/overview`)
          }
          type="primary"
        >
          Visit
        </Button>
        <Button type="primary" danger>
          Remove app
        </Button>
      </Space>
    );
  };

  return (
    <>
      <DetailsSection>
        <PageHeader
          fontSize={22}
          title="Edit application"
          className="pb-5"
          extra={<OperationButtons />}
        />
        <Descriptions>
          <DescriptionInputRow label="Name" onUpdate={onUpdate}>
            {application.name}
          </DescriptionInputRow>
        </Descriptions>
      </DetailsSection>
    </>
  );
};
