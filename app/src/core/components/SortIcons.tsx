import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";

export const SortIcons = ({ order, setOrder }) => {
  const iconStyles =
    "bg-canvas p-2 border borcer-solid border-seconary rounded-md cursor-pointer hover:ring-2 hover:ring-blue-500";

  return order === "DESC" ? (
    <SortDescendingOutlined className={iconStyles} onClick={() => setOrder("ASC")} />
  ) : (
    <SortAscendingOutlined className={iconStyles} onClick={() => setOrder("DESC")} />
  );
};
