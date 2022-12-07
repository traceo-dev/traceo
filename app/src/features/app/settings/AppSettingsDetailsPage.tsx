import { Space, Button, Typography } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ColumnSection } from "../../../core/components/ColumnSection";
import AppSettingsNavigationPage from "../../../features/app/settings/components/AppSettingsNavigation";
import api from "../../../core/lib/api";
import { dispatch } from "../../../store/store";
import { ApiResponse } from "../../../types/api";
import { StoreState } from "../../../types/store";
import { MemberRole } from "../../../types/application";
import { updateAplication } from "../state/actions";
import { useNavigate } from "react-router-dom";
import { Confirm } from "../../../core/components/Confirm";
import { Permissions } from "../../../core/components/Permissions";
import { PagePanel } from "../../../core/components/PagePanel";
import { DescriptionInputRow, Descriptions } from "../../../core/components/Descriptions";
import { slugifyForUrl } from "../../../core/utils/stringUtils";
import { useMemberRole } from "../../../core/hooks/useMemberRole";
import { notify } from "../../../core/utils/notify";
import { ApiKeySection } from "./components/ApiKeySection";

export const AppSettingsDetailsPage = () => {
  const navigate = useNavigate();
  const { isViewer } = useMemberRole();
  const { application } = useSelector((state: StoreState) => state.application);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  if (!application) {
    return null;
  }

  const onUpdateName = (name: string) => {
    if (!name) {
      notify.error("Application name cannot be empty.");
      return;
    }

    dispatch(updateAplication({ name }));

    window.location.href = `/app/${application.id}/${slugifyForUrl(
      name
    )}/settings/details`;
  };

  const remove = async () => {
    setLoadingDelete(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/application/${application.id}`)
      .then((response) => {
        if (response.status === "success") {
          navigate("/dashboard/overview");
        }
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };

  return (
    <AppSettingsNavigationPage>
      <PagePanel title="Basic Informations">
        <Descriptions>
          <DescriptionInputRow label="ID" editable={false}>
            <Typography.Text copyable>{application?.id}</Typography.Text>
          </DescriptionInputRow>
          <DescriptionInputRow label="Name" onUpdate={onUpdateName} editable={!isViewer}>
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
        <ApiKeySection />
      </Permissions>
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
