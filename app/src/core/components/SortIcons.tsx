import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";

export const SortIcons = ({ order, setOrder }) => {
  const iconStyles = "cursor-pointer action-icon hover:ring-2 hover:ring-blue-500";

  return order === "DESC" ? (
    <SortDescendingOutlined className={iconStyles} onClick={() => setOrder("ASC")} />
  ) : (
    <SortAscendingOutlined className={iconStyles} onClick={() => setOrder("DESC")} />
  );
};
