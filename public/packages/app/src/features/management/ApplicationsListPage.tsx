import { PlusOutlined } from "@ant-design/icons";
import { SearchWrapper } from "../../core/components/SearchWrapper";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NewApplicationModal } from "../../core/components/Modals/NewApplicationModal";
import { ApiQueryParams } from "../../core/lib/api";
import { useAppDispatch } from "../../store";
import { StoreState } from "@store/types";
import { ApplicationsTable } from "./components/ApplicationManagement/ApplicationsTable";
import { DashboardPageWrapper } from "./components/DashboardPageWrapper";
import { loadServerApplications } from "./state/applications/actions";
import { ConditionalWrapper } from "../../core/components/ConditionLayout";
import { DataNotFound } from "../../core/components/DataNotFound";
import { InputSearch, Button, Card } from "@traceo/ui";

export const ApplicationsListPage = () => {
  const dispatch = useAppDispatch();
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.serverApplications
  );
  const [search, setSearch] = useState<string>(null);
  const [openNewAppDrawer, setOpenNewAppDrawer] = useState<boolean>(false);

  const queryParams: ApiQueryParams = { search, order: "DESC", sortBy: "createdAt" };

  useEffect(() => {
    fetchApplications();
  }, [search]);

  const fetchApplications = () => {
    dispatch(loadServerApplications(queryParams));
  };

  return (
    <DashboardPageWrapper>
      <Card
        title="Applications list"
        extra={
          <Button onClick={() => setOpenNewAppDrawer(true)} icon={<PlusOutlined />}>
            New aplication
          </Button>
        }
      >
        <SearchWrapper className="pb-5">
          <InputSearch
            placeholder="Search application by name"
            value={search}
            onChange={setSearch}
          />
        </SearchWrapper>
        <ConditionalWrapper
          isEmpty={applications?.length === 0}
          isLoading={!hasFetched}
          emptyView={<DataNotFound label="Applications not found. Create first one!" />}
        >
          <ApplicationsTable applications={applications} hasFetched={hasFetched} />
        </ConditionalWrapper>
      </Card>

      <NewApplicationModal
        isOpen={openNewAppDrawer}
        onCancel={() => setOpenNewAppDrawer(false)}
        isAdmin={true}
      />
    </DashboardPageWrapper>
  );
};

export default ApplicationsListPage;
