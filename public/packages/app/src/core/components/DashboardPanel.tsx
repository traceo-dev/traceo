import { HTMLProps, forwardRef } from "react";
import { ContentCard } from "./ContentCard";
import { DashboardPanel as DashboardPanelType, Setter } from "@traceo/types";

interface Props extends Pick<HTMLProps<HTMLDivElement>, "className"> {
  panel: DashboardPanelType;
  options?: JSX.Element;
  loading?: boolean;
  children: JSX.Element;
  isEditable?: boolean;
  setHover?: Setter<boolean>;
}

export const DashboardPanel = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      panel = undefined,
      options = undefined,
      loading = false,
      className = undefined,
      setHover = undefined,
      isEditable = false
    },
    ref
  ) => {
    return (
      <ContentCard
        ref={ref}
        onMouseEnter={() => setHover && setHover(true)}
        onMouseLeave={() => setHover && setHover(false)}
        name={panel.title}
        tooltip={panel?.description}
        loading={loading}
        className={className}
        extra={options}
        isDraggable={isEditable}
      >
        {children}
      </ContentCard>
    );
  }
);
