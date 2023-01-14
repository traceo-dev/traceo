import { LoadingOutlined } from "@ant-design/icons";
import { joinClasses } from "core/utils/classes";

interface ListProps<T> {
  dataSource: T[];
  renderItem: (item: T) => JSX.Element;
  loading?: boolean;
  className?: string;
}
export function List<T>({
  dataSource,
  renderItem,
  loading = false,
  className
}: ListProps<T>) {
  if (loading) {
    return <LoadingOutlined />;
  }

  return (
    <ul className={joinClasses("m-0 p-0 list-none", className)}>
      {dataSource?.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
