import { Space, Button, Typography } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ColumnSection } from "../../../core/components/ColumnSection";
import AppSettingsNavigationPage from "../../../features/app/settings/components/AppSettingsNavigation";
import api from "../../../core/lib/api";
import { notify } from "../../../core/utils/notify";
import { handleStatus } from "../../../core/utils/response";
import { dispatch } from "../../../store/store";
import { ApiResponse } from "../../../types/api";
import { StoreState } from "../../../types/store";
import { MemberRole } from "../../../types/application";
import { updateAplication } from "../state/actions";
import { useNavigate } from "react-router-dom";
import { Confirm } from "../../../core/components/Confirm";
import { Permissions } from "../../../core/components/Permissions";
import { TRY_AGAIN_LATER_ERROR } from "../../../core/utils/constants";
import { PagePanel } from "../../../core/components/PagePanel";
import { DescriptionInputRow, Descriptions } from "../../../core/components/Descriptions";
import { slugifyForUrl } from "../../../core/utils/stringUtils";

export const AppSettingsDetailsPage = () => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.application);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  if (!application) {
    return null;
  }

  const onUpdateName = (name: string) => {
    dispatch(updateAplication({ name }));

    window.location.href = `/app/${application.id}/${slugifyForUrl(
      name
    )}/settings/details`;
  };

  const remove = async () => {
    setLoadingDelete(true);
    try {
      const response: ApiResponse<string> = await api.delete(
        `/api/application/${application.id}`
      );
      if (handleStatus(response.status) === "success") {
        notify.success("App successfully deleted");
        navigate("/dashboard/overview");
      } else {
        notify.error(TRY_AGAIN_LATER_ERROR);
      }
    } catch (error) {
      notify.error(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <AppSettingsNavigationPage>
      <PagePanel title="Basic Informations">
        <Descriptions>
          <DescriptionInputRow label="ID" editable={false}>
            {application?.id}
          </DescriptionInputRow>
          <DescriptionInputRow
            label="Name"
            onUpdate={onUpdateName}
            editable={application?.member?.role !== MemberRole.VIEWER}
          >
            {application?.name}
          </DescriptionInputRow>
          <DescriptionInputRow label="Created by" editable={false}>
            <span>
              {application?.owner?.name}
              {application?.owner?.email && application?.owner?.email}
            </span>
          </DescriptionInputRow>
        </Descriptions>
      </PagePanel>
      <Permissions statuses={[MemberRole.ADMINISTRATOR]}>
        <PagePanel title="Danger zone">
          <ColumnSection
            firstColumnWidth={12}
            secondColumnWidth={12}
            title={<Typography.Text className="text-red-700">Delete app</Typography.Text>}
            subtitle="Note that the removal of the application is immediate and irreversible. Only members with `Administrator` role can perform this operation."
          >
            <Space className="w-full mb-5">
              <Confirm
                withAuth={true}
                description="Are you sure that you want to remove this app?"
                onOk={() => remove()}
              >
                <Button type="primary" loading={loadingDelete} danger>
                  Delete
                </Button>
              </Confirm>
            </Space>
          </ColumnSection>
        </PagePanel>
      </Permissions>
    </AppSettingsNavigationPage>
  );
};

export default AppSettingsDetailsPage;
