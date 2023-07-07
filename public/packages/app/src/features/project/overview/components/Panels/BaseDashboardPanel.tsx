import { HTMLProps, forwardRef, useState } from "react";
import { ContentCard } from "../../../../../core/components/ContentCard";
import { DashboardPanel as DashboardPanelType, Setter, TimeRange } from "@traceo/types";
import { useNavigate, useParams } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import { RemovePanelConfirm } from "../RemovePanelConfirm";
import { useAppDispatch } from "src/store";
import { loadDashboard } from "../../state/actions";
import { PanelFallback } from "./PanelFallback";

interface Props extends Pick<HTMLProps<HTMLDivElement>, "className"> {
  title?: string;
  panel: DashboardPanelType;
  options?: JSX.Element;
  loading?: boolean;
  children: JSX.Element;
  isEditable?: boolean;
  isRemoveMode?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  isErrorExplain?: boolean;
  setHover?: Setter<boolean>;
  ranges: TimeRange;
}

export const BaseDashboardPanel = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      title = undefined,
      panel = undefined,
      loading = false,
      className = undefined,
      isEditable = false,
      isRemoveMode = false,
      isErrorExplain = true,
      isError = false,
      isEmpty = false,
      ranges = [undefined, undefined],
      options = undefined
    },
    ref
  ) => {
    const { id, dashboardId } = useParams();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isHover, setHover] = useState<boolean>(false);

    const panelName = !title ? panel.title : title;

    // To not showing tooltip when there is "preview" mode
    const tooltipValue = title ? undefined : panel?.description;

    const onRemovePanel = () => dispatch(loadDashboard(dashboardId));
    const onNavigate = () => {
      navigate({
        pathname: `/project/${id}/dashboard/${dashboardId}/panel/${panel.id}`,
        search: `?from=${ranges[0]}&to=${ranges[1]}`
      });
    };

    const renderOptions = () => {
      if (options) {
        return options;
      }

      if (isRemoveMode) {
        return (
          <RemovePanelConfirm panelId={panel.id} postExecute={onRemovePanel}>
            <CloseOutlined className="text-xs cursor-pointer hover:text-yellow-600" />
          </RemovePanelConfirm>
        );
      }

      if (isHover) {
        return (
          <span
            onClick={onNavigate}
            className="hover:text-sky-600 text-xs cursor-pointer font-semibold"
          >
            View
          </span>
        );
      }

      return undefined;
    };

    return (
      <ContentCard
        ref={ref}
        onMouseEnter={() => setHover && setHover(true)}
        onMouseLeave={() => setHover && setHover(false)}
        name={panelName}
        tooltip={tooltipValue}
        loading={loading}
        className={className}
        extra={renderOptions()}
        isDraggable={isEditable}
      >
        <PanelFallback
          isLoading={loading}
          isEmpty={isEmpty}
          isError={isError}
          isErrorExplain={isErrorExplain}
        >
          {children}
        </PanelFallback>
      </ContentCard>
    );
  }
);
