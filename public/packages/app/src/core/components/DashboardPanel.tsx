import { FC, useState } from "react";
import { ContentCard } from "./ContentCard";
import { To, useNavigate } from "react-router-dom";
import { SelectOutlined } from "@ant-design/icons";

interface Props {
  name: JSX.Element | string;
  options?: JSX.Element;
  loading?: boolean;
  navigateTo?: To;
  className?: string;
}
export const DashboardPanel: FC<Props> = ({
  children,
  name = undefined,
  options = undefined,
  loading = false,
  navigateTo = undefined,
  className = undefined
}) => {
  const navigate = useNavigate();
  const [isHover, setHover] = useState<boolean>(false);

  const renderExtra = () => {
    if (!options && isHover && navigateTo) {
      return (
        <SelectOutlined
          className="cursor-pointer hover:text-white text-sm"
          onClick={() => navigate(navigateTo)}
        />
      );
    }

    return options;
  };

  return (
    <ContentCard
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      name={name}
      loading={loading}
      className={className}
      extra={renderExtra()}
    >
      {children}
    </ContentCard>
  );
};
