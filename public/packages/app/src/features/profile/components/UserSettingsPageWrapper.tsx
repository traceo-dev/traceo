import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { Page } from "../../../core/components/Page";
import { useUser } from "../../../core/hooks/useUser";
import { MenuRoute } from "../../../core/types/navigation";
import { loadSignedInUser } from "../../../features/auth/state/actions";
import { useAppDispatch } from "../../../store/index";
import { SettingOutlined } from "@ant-design/icons";
import { Avatar } from "@traceo/ui";
import { useEffect } from "react";

export const UserSettingsPageWrapper = ({ children }) => {
  const user = useUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadSignedInUser());
  }, []);

  const menu: MenuRoute[] = [
    {
      href: "/dashboard/profile/settings",
      label: "Settings",
      key: "settings",
      icon: <SettingOutlined />
    }
  ];

  return (
    <Page
      menuRoutes={menu}
      header={{
        icon: <Avatar size="lg" src={user?.gravatar} alt={user.username} />,
        title: user.username,
        description: "Your account settings"
      }}
    >
      <ConditionalWrapper isLoading={!user.isFetched}>
        <Page.Content>{children}</Page.Content>
      </ConditionalWrapper>
    </Page>
  );
};
