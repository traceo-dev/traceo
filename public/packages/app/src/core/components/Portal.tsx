import { useEffect } from "react";
import ReactDOM from "react-dom";

const BASE_PORTAL_ID = "portal-element-div";

interface PortalProps {
  id?: string;
}

// Inject this component in other component to inject children from ToolbarPortal
export const PortalElement = ({ id = BASE_PORTAL_ID }: PortalProps) => {
  return <div id={id} />;
};

interface Props {
  id?: string;
  children: JSX.Element;
}
export const Portal = ({ children, id = BASE_PORTAL_ID }: Props) => {
  const mount = window.document.getElementById(id);
  const element = document.createElement("div");

  useEffect(() => {
    if (mount) {
      mount.appendChild(element);
    }

    return () => {
      mount.removeChild(element);
    };
  }, [element, mount]);

  return ReactDOM.createPortal(children, element);
};
