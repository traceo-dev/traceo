import { QuestionCircleOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Row } from "@traceo/ui";
import { GH_REPO_LINK } from "../../../../core/utils/constants";
import { logout } from "../../../../core/utils/logout";
import { RouterLink } from "../../RouterLink";
import { useUser } from "../../../../core/hooks/useUser";

export const RightHeaderSection = () => {
  const user = useUser();

  return (
    <Row className="gap-x-5 select-none">
      <a href={GH_REPO_LINK} target="blank" className="text-primary hover:text-white">
        <QuestionCircleOutlined className="icon-btn" />
        <span className="text-[12px] font-semibold">Help</span>
      </a>

      <RouterLink to={`/dashboard/profile/settings`}>
        <UserOutlined className="icon-btn" />
        <span className="text-[12px] font-semibold">{user.name ?? user.username}</span>
      </RouterLink>

      <LogoutOutlined onClick={() => logout()} className="icon-btn hover:text-red-400" />
    </Row>
  );
};
