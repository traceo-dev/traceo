import { resetProjectState } from "../../../features/project/state/project/reducers";
import { ConditionalWrapper } from "../../../core/components/ConditionLayout";
import { Page } from "../../../core/components/Page";
import { useUser } from "../../../core/hooks/useUser";
import { MenuRoute } from "../../../core/types/navigation";
import { loadSignedInUser } from "../../../features/auth/state/actions";
import { useAppDispatch } from "../../../store/index";
import { SettingOutlined } from "@ant-design/icons";
import { Avatar } from "@traceo/ui";
import { useEffect } from "react";

const menu: MenuRoute[] = [
  {
    href: "/dashboard/profile/settings",
    label: "Settings",
    key: "settings",
    icon: <SettingOutlined />
  }
];
export const UserSettingsPageWrapper = ({ children }) => {
  const user = useUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadSignedInUser());
    dispatch(resetProjectState());
  }, []);

  const getDocumentTitle = () => {
    return `Profile - ${user.name}`;
  };

  return (
    <Page
      title={getDocumentTitle()}
      menuRoutes={menu}
      header={{
        icon: <Avatar size="md" src={user?.gravatar} alt={user.username} />,
        title: user.username,
        description: "Your account settings"
      }}
    >
      <ConditionalWrapper isLoading={!user.isFetched}>
        <Page.Content className="pt-0">{children}</Page.Content>
      </ConditionalWrapper>
    </Page>
  );
};
