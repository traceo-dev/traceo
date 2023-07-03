import { HTMLProps, forwardRef } from "react";
import { ContentCard } from "./ContentCard";
import { To, useNavigate } from "react-router-dom";
import { SelectOutlined } from "@ant-design/icons";

interface Props extends Pick<HTMLProps<HTMLDivElement>, "onMouseEnter" | "onMouseLeave"> {
  name: JSX.Element | string;
  options?: JSX.Element;
  loading?: boolean;
  navigateTo?: To;
  className?: string;
  children: JSX.Element;
  isDraggable?: boolean;
}

export const DashboardPanel = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      name = undefined,
      options = undefined,
      loading = false,
      navigateTo = undefined,
      className = undefined,
      onMouseEnter = undefined,
      onMouseLeave = undefined,
      isDraggable = false
    },
    ref
  ) => {
    const navigate = useNavigate();

    const renderExtra = () => {
      if (!options && navigateTo) {
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
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        name={name}
        loading={loading}
        className={className}
        extra={renderExtra()}
        isDraggable={isDraggable}
      >
        {children}
      </ContentCard>
    );
  }
);
