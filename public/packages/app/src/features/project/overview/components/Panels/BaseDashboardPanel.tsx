import { HTMLProps, forwardRef, useState } from "react";
import { ContentCard } from "../../../../../core/components/ContentCard";
import {
  ApiResponse,
  Dashboard,
  DashboardPanel as DashboardPanelType,
  MemberRole,
  TimeRange
} from "@traceo/types";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined, DragOutlined, EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../../../store";
import { loadDashboard } from "../../state/actions";
import { PanelFallback } from "./PanelFallback";
import styled from "styled-components";
import { Popover } from "@traceo/ui";
import {
  PopoverSelectOptions,
  PopoverSelectOptionsProps
} from "../../../../../core/components/PopoverSelectOptions";
import api from "../../../../../core/lib/api";
import { notify } from "../../../../../core/utils/notify";
import { useProject } from "../../../../../core/hooks/useProject";

interface Props extends Pick<HTMLProps<HTMLDivElement>, "className"> {
  title?: string;
  panel: DashboardPanelType;
  dashboard?: Dashboard;
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
      options = undefined,
      dashboard = undefined
    },
    ref
  ) => {
    const { id, dashboardId } = useParams();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { permission } = useProject();

    const [isHover, setHover] = useState<boolean>(false);

    const panelName = !title ? panel.title : title;
    const isBaseDashboard = dashboard?.isBase;
    const isMaintainer = [MemberRole.ADMINISTRATOR, MemberRole.MAINTAINER].includes(permission);
    // To not showing tooltip when there is "preview" mode
    // const tooltipValue = title ? undefined : panel?.description;

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

      if (!isBaseDashboard && isMaintainer) {
        options.push({
          label: "Remove",
          icon: <DeleteOutlined />,
          onClick: () => onRemove()
        });
      }
      return <PopoverSelectOptions title="Options" options={options} />;
    };

    const renderPanelOptions = () => {
      if (isBaseDashboard || !isMaintainer) {
        return (
          <EyeOutlined
            className="cursor-pointer hover:text-white text-xs px-1"
            onClick={() => onNavigate()}
          />
        );
      }

      return (
        <Popover trigger="click" placement="bottom-end" content={renderOptions()}>
          <EllipsisOutlined className="cursor-pointer hover:text-white" />
        </Popover>
      );
    };

    return (
      <ContentCard
        ref={ref}
        onMouseEnter={() => setHover && setHover(true)}
        onMouseLeave={() => setHover && setHover(false)}
        name={panelName}
        // tooltip={tooltipValue}
        extra={options}
        loading={loading}
        className={className}
      >
        {isHover && isHoverOptions && (
          <NoHeaderOptions>
            {isEditable && !isBaseDashboard && (
              <DragOutlined className="drag-handle cursor-move hover:text-white" />
            )}
            {renderPanelOptions()}
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
