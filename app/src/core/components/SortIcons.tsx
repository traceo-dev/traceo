import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";

export const SortIcons = ({ order, setOrder }) => {
  return (
    <>
      {order === "DESC" ? (
        <SortDescendingOutlined
          className="cursor-pointer action-icon hover:bg-black hover:border-blue-500 hover:text-white focus:bg-black"
          onClick={() => setOrder("ASC")}
        />
      ) : (
        <SortAscendingOutlined
          className="cursor-pointer action-icon hover:bg-black hover:border-blue-500 hover:text-white focus:bg-black"
          onClick={() => setOrder("DESC")}
        />
      )}
    </>
  );
};
