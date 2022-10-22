import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { PagePanel } from "core/components/PagePanel";
import { SearchWrapper } from "core/components/SearchWrapper";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CreateApplicationModal } from "../../core/components/Modals/CreateApplicationModal";
import { SearchInput } from "../../core/components/SearchInput";
import { ApiQueryParams } from "../../core/lib/api";
import { dispatch } from "../../store/store";
import { StoreState } from "../../types/store";
import { ApplicationsTable } from "./components/ApplicationManagement/ApplicationsTable";
import { ManagementNavigation } from "./components/ManagementNavigation";
import { loadServerApplications } from "./state/applications/actions";

export const ManagementApplicationsPage = () => {
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.serverApplications
  );
  const [search, setSearch] = useState<string>(null);
  const [openNewAppDrawer, setOpenNewAppDrawer] = useState<boolean>(false);

  const queryParams: ApiQueryParams = { search, order: "DESC", sortBy: "createdAt" };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [search]);

  const fetchApplications = () => {
    dispatch(loadServerApplications(queryParams));
  };

  return (
    <ManagementNavigation>
      <PagePanel
        title="Applications list"
        extra={
          <Button
            onClick={() => setOpenNewAppDrawer(true)}
            type="primary"
            icon={<PlusOutlined />}
          >
            New aplication
          </Button>
        }
      >
        <SearchWrapper className="pb-5">
          <SearchInput
            placeholder="Seach application by name"
            value={search}
            setValue={setSearch}
          />
        </SearchWrapper>
        <ApplicationsTable applications={applications} hasFetched={hasFetched} />
      </PagePanel>

      <CreateApplicationModal
        isOpen={openNewAppDrawer}
        onCancel={() => setOpenNewAppDrawer(false)}
        isAdmin={true}
      />
    </ManagementNavigation>
  );
};

export default ManagementApplicationsPage;
