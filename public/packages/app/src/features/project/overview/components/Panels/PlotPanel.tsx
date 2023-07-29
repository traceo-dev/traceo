/* eslint @typescript-eslint/no-extra-semi: 0 */

import { BaseDashboardPanel } from "./BaseDashboardPanel";
import { BaseMetricChart } from "../../../../../core/components/UPlot/BaseMetricChart";
import { PanelProps } from "./types";
import { PanelLazyLoader } from "./PanelLoazyLoader";
import React from "react";
import { QueryResponseType } from "../../utils";
import api from "../../../../../core/lib/api";
import { ApiResponse } from "@traceo/types";
import dateUtils from "../../../../../core/utils/date";
import { conditionClass, joinClasses } from "@traceo/ui";

export interface State {
  data: QueryResponseType;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isVisible: boolean;
}

export class PlotPanel extends React.Component<PanelProps, State> {
  constructor(props: PanelProps) {
    super(props);

    this.state = {
      data: {
        datasource: [],
        options: undefined
      },
      isEmpty: false,
      isError: false,
      isLoading: false,
      isVisible: false
    };

    this.onVisibleChange = this.onVisibleChange.bind(this);
  }

  async loadDatasource() {
    if (this.state.isVisible || !this.props.lazy) {
      const { ranges, project, panel } = this.props;

      this.setState({ isLoading: true, isError: false, isEmpty: false });
      /**
       * Remove promises from fetching data to panels
       * use subscribers and rxjs
       */
      await api
        .get<ApiResponse<QueryResponseType>>(`/api/metrics/${project.id}/preview/${panel.id}`, {
          from: ranges[0],
          to: ranges[1],
          tz: dateUtils.guessTz()
        })
        .then((res) => {
          this.setState({
            data: res.data,
            isLoading: true,
            isEmpty: res.data.datasource.length === 0
          });
        })
        .catch(() => {
          this.setState({ isError: true });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  componentDidMount(): void {
    this.loadDatasource();
  }

  componentDidUpdate(prevProps: PanelProps) {
    // reload datasource when time ranges has been changed
    if (this.props.ranges !== prevProps.ranges) {
      this.loadDatasource();
    }
  }

  onVisibleChange(isVisible: boolean) {
    this.setState({ isVisible });
    if (this.state.isVisible) {
      this.loadDatasource();
    }
  }

  renderPanelContent() {
    const { height, panel, lazy, onChangeTimeRange } = this.props;
    const { isLoading, data } = this.state;

    return (
      <BaseDashboardPanel
        loading={isLoading}
        className={joinClasses("overflow-hidden", conditionClass(lazy, "h-full"))}
        // TODO: no idea why overflow-hidden not working for y...
        bodyClassName="p-0 overflow-hidden overflow-y-hidden"
        {...this.props}
        {...this.state}
      >
        <BaseMetricChart
          height={height}
          datasource={data.datasource}
          panel={panel}
          onZoom={onChangeTimeRange}
        />
      </BaseDashboardPanel>
    );
  }

  render() {
    const { lazy } = this.props;

    return lazy ? (
      <PanelLazyLoader onVisibleChange={this.onVisibleChange}>
        {this.renderPanelContent()}
      </PanelLazyLoader>
    ) : (
      this.renderPanelContent()
    );
  }
}
