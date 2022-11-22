import { CheckCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { List, Popover, Space, Table, Typography } from "antd";
import { useSelector } from "react-redux";
import { Avatar } from "../../../../../core/components/Avatar";
import { StoreState } from "../../../../../types/store";
import { Application, ApplicationMember } from "../../../../../types/application";
import { conditionClass, joinClasses } from "../../../../../core/utils/classes";
import { slugifyForUrl } from "../../../../../core/utils/stringUtils";
import { useEffect } from "react";
import { dispatch } from "../../../../../store/store";
import { loadApplications } from "../../../../../features/dashboard/state/actions";
import { ConditionLayout } from "../../../../../core/components/ConditionLayout";

export const AppSwitcher = () => {
  const { application, hasFetched } = useSelector(
    (state: StoreState) => state.application
  );
  const { applications, hasFetched: fetchedApps } = useSelector(
    (state: StoreState) => state.applications
  );

  useEffect(() => {
    dispatch(loadApplications());
  }, []);

  const selectApp = (application: Application) => {
    // TODO: for some reason with using navigate first is 404 view and then go to the app overview
    // navigate(`/app/${application.id}/${slugifyForUrl(application.name)}/overview`);
    window.location.href = `/app/${application.id}/${slugifyForUrl(
      application.name
    )}/overview`;
  };

  const appSelector = () => (
    <ConditionLayout isLoading={!fetchedApps}>
      {/* <Table
        scroll={{ y: 240 }}
        // pagination={{ }}
        dataSource={applications}
        columns={[
          {
            render: (record: ApplicationMember) => record.application.name
          }
        ]}
      /> */}
      {applications?.map((app: ApplicationMember, index) => (
        <Space key={index} className="py-2 w-full">
          <Typography.Text
            className={joinClasses(
              "cursor-pointer",
              conditionClass(
                app.application.id === application.id,
                "font-semibold text-cyan-600"
              )
            )}
            onClick={() => selectApp(app.application)}
          >
            {app.application.name}
            {app.application.id === application.id && (
              <CheckCircleFilled className="pl-2" />
            )}
          </Typography.Text>
        </Space>
      ))}
    </ConditionLayout>
  );

  return (
    <Popover
      trigger={["click"]}
      placement="bottomRight"
      title="Change app"
      content={appSelector}
    >
      <Space className="cursor-pointer">
        {!hasFetched ? (
          <LoadingOutlined />
        ) : (
          <Avatar shape="circle" name={application.name} url={application?.gravatar} />
        )}
      </Space>
    </Popover>
  );
};
