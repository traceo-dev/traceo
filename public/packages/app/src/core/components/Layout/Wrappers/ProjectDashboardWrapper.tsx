import React from "react";
import withProject from "../../../hooks/withProject";

// Main wrapper for every project page to use withProject HOC
const ProjectDashboardWrapper = ({ children, ...props }) => {
  return React.cloneElement(children, props);
};
export default withProject(ProjectDashboardWrapper);
