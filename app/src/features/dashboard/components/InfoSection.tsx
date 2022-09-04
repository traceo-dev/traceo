import { Alert } from "antd";
import { useSelector } from "react-redux";
import { StoreState } from "src/types/store";

export const InfoSection = () => {
  const { account } = useSelector((state: StoreState) => state.account);

  return (
    <>
      {!account?.active && (
        <Alert
          showIcon
          type="error"
          message="The registration process has not been completed. Please confirm your identity by clicking on the link in the email you received."
        />
      )}
      <Alert
        className="mt-2"
        showIcon
        type="warning"
        message="Traceo is still in a preview mode. For this reason, there may be interruptions in the provision of services as well as errors and undefined problems with the availability of the website."
      />
    </>
  );
};
