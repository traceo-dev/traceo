import { PageCenter } from "../components/PageCenter";
import { TraceoLoading } from "../components/TraceoLoading";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MemberRole } from "@traceo/types";
import { initProject } from "../../features/project/state/project/actions";
import { useAppDispatch } from "../../store";
import { useProject } from "./useProject";
import { Col, Typography } from "@traceo/ui";
import { BaseProjectViewType } from "../types/hoc";

const withProject = (WrappedComponent: React.ComponentType<BaseProjectViewType>) => {
  const render = (props) => {
    const { id } = useParams();
    const [_, setIsMounted] = useState(true);
    const { project, isLoading, permission } = useProject();

    const dispatch = useAppDispatch();
    useEffect(() => {
      dispatch(
        initProject({
          id
        })
      );

      return () => {
        setIsMounted(false);
      };
    }, [id]);

    if (isLoading) {
      return <TraceoLoading />;
    }

    if (permission && permission === MemberRole.NONE) {
      return (
        <PageCenter>
          <Col className="text-center w-full items-center">
            <span className="text-[85px] font-bold">404</span>
            <Typography className="pt-2 text-[26px]">
              This page doesn&apos;t exist or you have no permission to be here.
            </Typography>
          </Col>
        </PageCenter>
      );
    }

    return <WrappedComponent project={project} permission={permission} {...props} />;
  };

  return render;
};

export default withProject;
