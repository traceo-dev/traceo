import { UserOutlined } from "@ant-design/icons";
import { Popover, Space, Typography } from "antd";
import { useDemo } from "core/hooks/useDemo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../../../../core/components/Avatar";
import { joinClasses } from "../../../../../core/utils/classes";
import { StoreState } from "../../../../../types/store";

interface ProfileRoute {
  href?: string;
  onClick?: () => void;
  name: string;
  className?: string;
  private?: boolean;
}
export const Profile = () => {
  const { account } = useSelector((state: StoreState) => state.account);
  const navigate = useNavigate();
  const { isDemo } = useDemo();

  const logout = () => {
    localStorage.removeItem("session");
    sessionStorage.clear();
    window.location.href = "/";
  };

  const routes: ProfileRoute[] = [
    {
      href: "/dashboard/overview",
      name: "Dashboard"
    },
    {
      href: "/dashboard/account/settings",
      name: "Settings",
      private: isDemo
    },
    {
      name: "Sign out",
      className: "text-red-500 hover:text-red-700",
      onClick: () => logout()
    }
  ];

  const profileContent = routes
    .filter((r) => !r.private)
    .map((route, index) => (
      <Space key={index} className="py-2 w-full">
        <Typography.Text
          className={joinClasses(
            route.className,
            "hover:text-gray-300 cursor-pointer font-semibold"
          )}
          onClick={() => (route.href ? navigate(route.href) : route.onClick())}
        >
          {route.name}
        </Typography.Text>
      </Space>
    ));

  const name = () => {
    if (!account?.name) {
      return account?.username;
    }
    return account.name;
  };

  return (
    <>
      <Popover
        title={
          <Space className="px-1 py-2">
            <Avatar
              size="small"
              shape="circle"
              url={account?.gravatar}
              name={account?.name}
            />
            <Typography.Text>{name()}</Typography.Text>
          </Space>
        }
        placement="bottomLeft"
        className="min-w-42"
        content={profileContent}
      >
        <UserOutlined className="icon-small" />
      </Popover>
      <style>{`
        .content > .ant-popover {
            width: 234px;
        }
    `}</style>
    </>
  );
};
