import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";

export const SortIcons = ({ order, setOrder }) => {
  return (
    <>
      {order === "DESC" ? (
        <SortDescendingOutlined
          className="cursor-pointer action-icon"
          onClick={() => setOrder("ASC")}
        />
      ) : (
        <SortAscendingOutlined
          className="cursor-pointer action-icon"
          onClick={() => setOrder("DESC")}
        />
      )}
    </>
  );
};
