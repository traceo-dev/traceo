import { Button, Dropdown, Menu } from "antd";
import { handleIncidentSort, IncidentSortBy } from "src/types/incidents";

export const IncidentsSortDropdown = ({ sortBy, setSortBy }) => {
  const sortByContent = (
    <Menu style={{ width: 200 }} onClick={(val) => setSortBy(val.key as IncidentSortBy)}>
      <Menu.Item key={IncidentSortBy.LAST_SEEN}>Last seen</Menu.Item>
      <Menu.Item key={IncidentSortBy.FIRST_SEEN}>First seen</Menu.Item>
      <Menu.Item key={IncidentSortBy.STATUS}>Status</Menu.Item>
      <Menu.Item key={IncidentSortBy.OCCUR_COUNT}>Occur count</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={sortByContent} placement="bottom">
      <Button>
        <span>Sort by:</span>
        <span className="font-bold">&nbsp;{handleIncidentSort[sortBy]}</span>
      </Button>
    </Dropdown>
  );
};
