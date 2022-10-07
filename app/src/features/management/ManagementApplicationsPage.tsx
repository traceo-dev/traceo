import { PlusOutlined } from "@ant-design/icons";
import { Space, Button } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CreateApplicationDrawer } from "../../core/components/Drawers/CreateApplicationDrawer";
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
      <Space className="w-full pb-2 justify-between">
        <SearchInput value={search} setValue={setSearch} />
        <Button
          onClick={() => setOpenNewAppDrawer(true)}
          type="primary"
          icon={<PlusOutlined />}
        >
          New aplication
        </Button>
      </Space>
      <ApplicationsTable applications={applications} hasFetched={hasFetched} />
      <CreateApplicationDrawer
        isOpen={openNewAppDrawer}
        onCancel={() => setOpenNewAppDrawer(false)}
        isAdmin={true}
      />
    </ManagementNavigation>
  );
};

export default ManagementApplicationsPage;
