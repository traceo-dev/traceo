import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import React from "react";

export const SortIcons = ({ order, setOrder }) => {
  const iconStyles =
    "cursor-pointer action-icon hover:bg-black hover:border-blue-500 hover:text-white focus:bg-black";

  return (
    <>
      {order === "DESC" ? (
        <SortDescendingOutlined className={iconStyles} onClick={() => setOrder("ASC")} />
      ) : (
        <SortAscendingOutlined className={iconStyles} onClick={() => setOrder("DESC")} />
      )}
    </>
  );
};
