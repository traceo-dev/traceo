import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Col, Menu, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { ConditionLayout } from "src/core/components/ConditionLayout";
import { EmptyAppList } from "src/core/components/EmptyViews/EmptyAppList";
import { SearchInput } from "src/core/components/SearchInput";
import { SortIcons } from "src/core/components/SortIcons";
import { SortOrder } from "src/types/api";
import { SearchApplicationQueryParams } from "src/types/application";
import { AppsSortBy, handleAppSort } from "src/core/utils/handlers";
import { dispatch } from "src/store/store";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";
import { CreateApplicationDrawer } from "../../../core/components/Drawers/CreateApplicationDrawer";
import { EditChartsDrawer } from "src/core/components/Drawers/EditChartsDrawer";
import { AppCard } from "./AppCard";
import { StatusDropdown } from "src/core/components/StatusDropdown";
import { loadApplications } from "../state/actions";

export const AppsTable = () => {
  const { applications, hasFetched } = useSelector(
    (state: StoreState) => state.applications
  );

  const [order, setOrder] = useState<SortOrder>("ASC");
  const [searchValue, setSearchValue] = useState<string>(null);
  const [sortBy, setSortBy] = useState<AppsSortBy>(AppsSortBy.LAST_INCIDENT);
  const [openApplicationModal, setOpenApplicationModal] = useState<boolean>(false);
  const [openEditChartsModal, setOpenEditChartsModal] = useState<boolean>(false);

  const queryParams: SearchApplicationQueryParams = {
    order,
    sortBy,
    search: searchValue
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [order, sortBy, searchValue]);

  const fetchApplications = () => {
    dispatch(loadApplications(queryParams));
  };

  const sortByContent = (
    <Menu style={{ width: 200 }} onClick={(val) => setSortBy(val.key as AppsSortBy)}>
      <Menu.Item key={AppsSortBy.LAST_INCIDENT}>Last incident</Menu.Item>
      <Menu.Item key={AppsSortBy.CREATED_AT}>Created at</Menu.Item>
      <Menu.Item key={AppsSortBy.LAST_UPDATE}>Last update</Menu.Item>
    </Menu>
  );

  const renderSearchHeader = () => (
    <Space className="w-full justify-between">
      <Space>
        <SearchInput
          placeholder="Search"
          value={searchValue}
          setValue={setSearchValue}
          get={() => fetchApplications()}
        />
        <StatusDropdown overlay={sortByContent} value={handleAppSort[sortBy]} />
        <SortIcons order={order} setOrder={setOrder} />
        <SettingOutlined
          onClick={() => setOpenEditChartsModal(true)}
          className="action-icon"
        />
      </Space>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setOpenApplicationModal(true)}
        type="primary"
      >
        Create new app
      </Button>
    </Space>
  );

  return (
    <>
      {renderSearchHeader()}
      <ConditionLayout
        isLoading={!hasFetched}
        isEmpty={applications?.length === 0}
        emptyView={<EmptyAppList constraints={searchValue} />}
      >
        <Row className="pt-5" gutter={[8, 24]}>
          {applications?.map((app, index) => (
            <Col key={index} span={8}>
              <AppCard app={app} />
            </Col>
          ))}
        </Row>
      </ConditionLayout>
      <CreateApplicationDrawer
        isOpen={openApplicationModal}
        onCancel={() => setOpenApplicationModal(false)}
      />
      <EditChartsDrawer
        isOpen={openEditChartsModal}
        onCancel={() => setOpenEditChartsModal(false)}
      />
    </>
  );
};
