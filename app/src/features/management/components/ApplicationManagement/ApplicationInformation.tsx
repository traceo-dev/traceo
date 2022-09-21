import { Button, Space } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Confirm } from "../../../../core/components/Confirm";
import {
  DescriptionInputRow,
  Descriptions
} from "../../../../core/components/Descriptions";
import { DetailsSection } from "../../../../core/components/DetailsSection";
import PageHeader from "../../../../core/components/PageHeader";
import api from "../../../../core/lib/api";
import { notify } from "../../../../core/utils/notify";
import { handleStatus } from "../../../../core/utils/response";
import { dispatch } from "../../../../store/store";
import { ApiResponse } from "../../../../types/api";
import { StoreState } from "../../../../types/store";
import { loadServerApplication } from "../../state/applications/actions";

export const ApplicationInformation = () => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.serverApplications);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

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

  const onRemove = async () => {
    setLoadingDelete(true);
    try {
      const response: ApiResponse<string> = await api.delete(
        `/api/application/${application.id}`
      );
      if (handleStatus(response.status) === "success") {
        notify.success("App successfully deleted");
        navigate("/dashboard/management/apps");
      } else {
        notify.error("App not deleted. Please try again later.");
      }
    } catch (error) {
      notify.error(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const OperationButtons = () => {
    return (
      <Space className="w-full justify-end">
        {/* <Button
          onClick={() =>
            navigate(`/app/${application.id}/${slugifyForUrl(application.name)}/overview`)
          }
          type="primary"
        >
          Visit
        </Button> */}
        <Confirm
          withAuth={true}
          description="Are you sure that you want to remove this app?"
          onOk={() => onRemove()}
        >
          <Button type="primary" loading={loadingDelete} danger>
            Remove app
          </Button>
        </Confirm>
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
