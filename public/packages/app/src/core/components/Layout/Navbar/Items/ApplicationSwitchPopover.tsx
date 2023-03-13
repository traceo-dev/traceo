import { useAppDispatch } from "../../../../../store";
import { StoreState } from "@store/types";
import { Popover, Avatar } from "@traceo/ui";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadApplications } from "src/features/dashboard/state/actions";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const AppRow = styled.div`
  text-align: start;
  padding: 6px;
  padding-inline: 18px;
  margin-bottom: 5px;
  color: var(--color-text-primary);

  &:hover {
    background-color: var(--color-bg-secondary);
    color: #ffffff;
  }
`;

export const ApplicationSwitchPopover = () => {
  const dispatch = useAppDispatch();
  const { application, hasFetched } = useSelector((state: StoreState) => state.application);

  useEffect(() => {
    dispatch(loadApplications());
  }, []);

  const options = [
    {
      label: "Applications",
      href: "/dashboard/overview"
    },
    {
      label: "Members",
      href: `/app/${application.id}/settings/access`
    },
    {
      label: "Settings",
      href: `/app/${application.id}/settings/details`
    }
  ];

  const content = (
    <div className="flex flex-col w-[230px]">
      <span className="text-start border-bottom p-3">
        <div className="flex flex-row items-center">
          <Avatar size="md" alt={application.name} src={application.gravatar} />
          <div className="flex flex-col text-start pl-2">
            <span className="font-semibold">{application.name}</span>
            <span className="text-xs">{application.sdk}</span>
          </div>
        </div>
      </span>
      <div className="py-3">
        {options?.map(({ label, href }, index) => (
          <Link to={href} key={index}>
            <AppRow>{label}</AppRow>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottom-end"
      showArrow={false}
      overrideStyles={{
        marginTop: "15px",
        transitionDuration: 0
      }}
      content={content}
    >
      <div className="flex flex-row w-full justify-between items-center">
        {!hasFetched ? (
          <LoadingOutlined />
        ) : (
          <Avatar size="md" alt={application.name} src={application.gravatar} />
        )}
        <div className="flex flex-col text-start pl-2">
          <span className="font-semibold">{application.name}</span>
          <span className="text-xs">{application.sdk}</span>
        </div>
      </div>
    </Popover>
  );
};
