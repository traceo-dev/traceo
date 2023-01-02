import { useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { loadAccount } from "../../auth/state/actions";
import { dispatch } from "../../../store/store";
import { LoadingOutlined } from "@ant-design/icons";
import { isEmptyObject } from "../../../core/utils/object";
import { PageCenter } from "../../../core/components/PageCenter";
import { useCleanup } from "../../../core/hooks/useCleanup";
import { toggleNavbar } from "../../../features/app/state/navbar/actions";

export const DashboardPage = ({ children }) => {
  useCleanup((state: StoreState) => state.application);

  const { account } = useSelector((state: StoreState) => state.account);

  useEffect(() => {
    dispatch(toggleNavbar(false));
    dispatch(loadAccount());
  }, []);

  if (!account || isEmptyObject(account)) {
    return (
      <PageCenter>
        <LoadingOutlined />
      </PageCenter>
    );
  }

  return (
    <>
      <div className="pb-5 pt-12">{children}</div>
      <style>
        {`
        @media screen and (min-width: 1605px) {
          .page-scrollbar-content {
            padding-top: 20px;
            max-width: 1450px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}
      </style>
    </>
  );
};
