import { Row } from "@traceo/ui";
import { GH_REPO_LINK } from "../utils/constants";
import { InfoCircleFilled } from "@ant-design/icons";

export const DemoBanner = () => {
  return (
    <Row className="text-xs bg-blue-900 text-blue-100 leading-5 p-3 m-3 rounded-mdr">
      <InfoCircleFilled className="text-lg" />
      <div className="ml-2  w-full flex flex-col">
        <span className="leading-4">
          Many features of the Traceo platform have been blocked in the Demo version.
        </span>
        <span className="mt-2">Install your own instance to discover its full potential.</span>
        <span className="mt-2">
          More informations{" "}
          <a className="text-yellow-500" target="_blank" href={GH_REPO_LINK}>
            here
          </a>
          .
        </span>
      </div>
    </Row>
  );
};
