import { ConfigProvider, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FC } from "react";

type PaginationPostions = "bottomCenter" | "bottomRight" | "bottomLeft";
interface Props {
  dataSource: any[];
  pageSize?: number;
  loading?: boolean;
  columns: ColumnsType<any>;
  key?: string;
  className?: string;
  showHeader?: boolean;
  showPagination?: boolean;
  paginationPosition?: PaginationPostions[];
  emptyView?: any;
  onRowClick?: (record: any) => void;
}
export const PaginatedTable: FC<Props> = ({
  key,
  dataSource,
  pageSize = 5,
  loading,
  columns,
  className,
  showHeader,
  showPagination = true,
  paginationPosition,
  emptyView,
  onRowClick
}) => {
  const customizeRenderEmpty = () =>
    emptyView && !loading ? (
      <div className="positioned-div my-12">{emptyView}</div>
    ) : undefined;

  return (
    <ConfigProvider renderEmpty={() => customizeRenderEmpty()}>
      <Table
        showHeader={showHeader ?? true}
        rowKey={key ?? "id"}
        dataSource={dataSource}
        onRow={(record) => {
          return {
            onClick: () => {
              onRowClick(record);
            }
          };
        }}
        pagination={
          showPagination
            ? {
                defaultPageSize: pageSize,
                total: dataSource?.length,
                position: paginationPosition,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 15]
              }
            : false
        }
        loading={loading}
        columns={columns}
        className={className}
      />
    </ConfigProvider>
  );
};
