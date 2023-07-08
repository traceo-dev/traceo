import { HTMLProps, forwardRef, useState } from "react";
import { ContentCard } from "../../../../../core/components/ContentCard";
import { ApiResponse, DashboardPanel as DashboardPanelType, TimeRange } from "@traceo/types";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined, DragOutlined, EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { useAppDispatch } from "src/store";
import { loadDashboard } from "../../state/actions";
import { PanelFallback } from "./PanelFallback";
import styled from "styled-components";
import { Popover } from "@traceo/ui";
import {
  PopoverSelectOptions,
  PopoverSelectOptionsProps
} from "src/core/components/PopoverSelectOptions";
import { useDashboard } from "src/core/hooks/useDashboard";
import api from "src/core/lib/api";
import { notify } from "src/core/utils/notify";

interface Props extends Pick<HTMLProps<HTMLDivElement>, "className"> {
  title?: string;
  panel: DashboardPanelType;
  options?: JSX.Element;
  loading?: boolean;
  children: JSX.Element;
  isEditable?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  isErrorExplain?: boolean;
  isHoverOptions?: boolean;
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
      isErrorExplain = true,
      isHoverOptions = true,
      isError = false,
      isEmpty = false,
      ranges = [undefined, undefined],
      options = undefined
    },
    ref
  ) => {
    const { id, dashboardId } = useParams();

    const { dashboard } = useDashboard();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isHover, setHover] = useState<boolean>(false);

    const panelName = !title ? panel.title : title;
    const isBaseDashboard = dashboard.isBase;

    // To not showing tooltip when there is "preview" mode
    const tooltipValue = title ? undefined : panel?.description;

    const onRemovePanel = () => dispatch(loadDashboard(dashboardId));
    const onNavigate = () => {
      navigate({
        pathname: `/project/${id}/dashboard/${dashboardId}/panel/${panel.id}`,
        search: `?from=${ranges[0]}&to=${ranges[1]}`
      });
    };

    const onRemove = async () => {
      await api
        .delete<ApiResponse<string>>(`/api/dashboard/panel/${panel.id}`)
        .then(() => {
          navigate(`/project/${id}/dashboard/${dashboardId}`);
        })
        .catch(() => notify.error("Panel cannot be deleted. Please try again later."))
        .finally(() => dispatch(loadDashboard(dashboardId)));
    };

    const renderOptions = () => {
      const options: PopoverSelectOptionsProps[] = [
        {
          label: "View",
          icon: <EyeOutlined />,
          onClick: () => onNavigate()
        }
      ];

      if (!isBaseDashboard) {
        options.push({
          label: "Remove",
          icon: <DeleteOutlined />,
          onClick: () => onRemove()
        });
      }
      return <PopoverSelectOptions title="Options" options={options} />;
    };

    return (
      <ContentCard
        ref={ref}
        onMouseEnter={() => setHover && setHover(true)}
        onMouseLeave={() => setHover && setHover(false)}
        name={panelName}
        tooltip={tooltipValue}
        extra={options}
        loading={loading}
        className={className}
        isDraggable={isEditable}
      >
        {isHover && isHoverOptions && (
          <NoHeaderOptions>
            {!panelName && <DragOutlined className="drag-handle cursor-move hover:text-white" />}
            {isBaseDashboard && (
              <EyeOutlined
                className="cursor-pointer hover:text-white text-xs px-1"
                onClick={() => onNavigate()}
              />
            )}
            {!isBaseDashboard && (
              <Popover
                showArrow={false}
                trigger="click"
                placement="bottom-end"
                overrideStyles={{ marginTop: "15px" }}
                content={renderOptions()}
              >
                <EllipsisOutlined className="cursor-pointer hover:text-white" />
              </Popover>
            )}
          </NoHeaderOptions>
        )}
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

const NoHeaderOptions = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;
  padding: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px !important;
  color: var(--color-text-primary);
  background-color: var(--color-bg-secondary);
  font-size: 16px;
  border-bottom-left-radius: 2px;
`;
