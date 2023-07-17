/**
 * Proof of concept class to manage navbar tree on server side.
 */

import { Injectable } from "@nestjs/common";
import { MemberRole, NavItem } from "@traceo/types";
import { DashboardQueryService } from "src/api/dashboard/dashboard-query/dashboard-query.service";
import { MemberQueryService } from "src/api/member/member-query/member-query.service";
import { ProjectQueryService } from "src/api/project/project-query/project-query.service";
import { UserQueryService } from "src/api/user/user-query/user-query.service";

type NavTreeQuery = {
    userId: string;
    projectId: string;
}
@Injectable()
export class NavTreeService {

    constructor(
        private readonly userQueryService: UserQueryService,
        private readonly projectQueryService: ProjectQueryService,
        private readonly dashboardsQueryService: DashboardQueryService,
        private readonly memberQueryService: MemberQueryService
    ) { }

    public async buildTree(query: NavTreeQuery): Promise<NavItem[]> {
        const treeRoot: NavItem[] = [];

        const user = await this.userQueryService.getDto(query.userId);
        const isAdmin = user.isAdmin;

        if (query.projectId) {
            const project = await this.projectQueryService.getDto(query.projectId);
            const dashboards = await this.dashboardsQueryService.getListDto(project.id);
            const permission = await this.memberQueryService.getProjectPermission(user.id, project.id);

            const isProjectAdmin = permission === MemberRole.ADMINISTRATOR;
            const isProjectMaintainer = permission === MemberRole.MAINTAINER;

            const dashboardRoot: NavItem = {
                id: "dashboards",
                label: "Dashboards",
                icon: "AppstoreFilled",
                subtitle: undefined,
                url: undefined,
                items: []
            };

            for (const dashboard of dashboards) {
                dashboardRoot.items.push({
                    id: `dashboard_${dashboard.id}`,
                    label: dashboard.name,
                    icon: undefined,
                    subtitle: undefined,
                    url: `/project/${project.id}/dashboard/${dashboard.id}`
                })
            };

            treeRoot.push(dashboardRoot);

            treeRoot.push({
                id: "incidents",
                label: "Incidents",
                icon: "BugOutlined",
                url: `/project/${project.id}/incidents`,
                items: []
            });

            const exploreRoot: NavItem = {
                id: "explore",
                label: "explore",
                icon: "CompassOutlined",
                subtitle: undefined,
                url: undefined,
                items: []
            };

            exploreRoot.items.push({
                id: "explore_logs",
                label: "Logs",
                icon: undefined,
                subtitle: undefined,
                url: `/project/${project.id}/explore?type=logs`
            });

            exploreRoot.items.push({
                id: "explore_metrics",
                label: "Metrics",
                icon: undefined,
                subtitle: undefined,
                url: `/project/${project.id}/explore?type=metrics`
            });

            exploreRoot.items.push({
                id: "explore_traces",
                label: "Traces",
                icon: undefined,
                subtitle: undefined,
                url: `/project/${project.id}/explore?type=traces`
            });

            treeRoot.push(exploreRoot);

            const settingsRoot: NavItem = {
                id: "settings",
                label: "Settings",
                icon: "SettingOutlined",
                subtitle: undefined,
                url: undefined,
                items: []
            };

            settingsRoot.items.push({
                id: "settings_details",
                label: "Details",
                icon: "InfoCircleOutlined",
                subtitle: undefined,
                url: `/project/${project.id}/settings/details`
            });

            if (isProjectAdmin || isProjectMaintainer) {
                settingsRoot.items.push({
                    id: "settings_access",
                    label: "Access",
                    icon: "TeamOutlined",
                    subtitle: undefined,
                    url: `/project/${project.id}/settings/access`
                });
            }


            treeRoot.push(settingsRoot);
        } else {
            treeRoot.push({
                id: "overview",
                label: "Overview",
                icon: "AppstoreOutlined",
                items: [],
                subtitle: undefined,
                url: `/dashboard/projects`
            })
        }

        if (isAdmin) {
            const adminPanelRoot: NavItem = {
                id: "admin_panel",
                label: "Administration",
                icon: "SettingOutlined",
                subtitle: undefined,
                url: undefined,
                items: []
            };

            adminPanelRoot.items.push({
                id: "admin_panel_users",
                label: "Users",
                icon: "TeamOutlined",
                subtitle: undefined,
                url: `/dashboard/admin/users`,
            });

            adminPanelRoot.items.push({
                id: "admin_panel_projects",
                label: "Projects",
                icon: "AppstoreFilled",
                subtitle: undefined,
                url: `/dashboard/admin/projects`,
            });

            adminPanelRoot.items.push({
                id: "admin_panel_instance_info",
                label: "Instance Info",
                icon: "InfoCircleOutlined",
                subtitle: undefined,
                url: `/dashboard/admin/instance`,
            });

            treeRoot.push(adminPanelRoot);
        }

        const profileRoot: NavItem = {
            id: "profile",
            label: "Profile",
            icon: "UserOutlined",
            subtitle: undefined,
            url: undefined,
            items: []
        };

        profileRoot.items.push({
            id: "profile_settings",
            label: "Settings",
            icon: "SettingOutlined",
            subtitle: undefined,
            url: "/dashboard/profile/settings"
        });

        treeRoot.push(profileRoot);

        return treeRoot;
    }

    public async hasAccess() { }

    public async getDashboardsNode() { }

    public async getIncidentsNode() { }

    public async getExploreNode() { }

    public async getSettingsNode() { }

    public async getPerformanceNode() { }

    public async getAdminNode() { }

    public async getProfileNode() { }

    public async getOverviewNode() { }
}