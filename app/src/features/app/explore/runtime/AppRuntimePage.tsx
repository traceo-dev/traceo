import { ConditionLayout } from "../../../../core/components/ConditionLayout";
import { DataNotFound } from "../../../../core/components/DataNotFound";
import { DescriptionRow, Descriptions } from "../../../../core/components/Descriptions";
import { PagePanel } from "../../../../core/components/PagePanel";
import { TraceoLoading } from "../../../../core/components/TraceoLoading";
import { isEmptyObject } from "../../../../core/utils/object";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { dispatch } from "../../../../store/store";
import { StoreState } from "../../../../types/store";
import AppExploreNavigationPage from "../components/AppExploreNavigation";
import { loadApplicationRuntime } from "./state/actions";

const AppRuntimePage = () => {
  const { runtime, hasFetched } = useSelector((state: StoreState) => state.configuration);

  useEffect(() => {
    dispatch(loadApplicationRuntime());
  }, []);

  if (!runtime) {
    return <TraceoLoading />;
  }

  return (
    <AppExploreNavigationPage>
      <PagePanel title="Runtime configuration">
        <ConditionLayout
          isLoading={!hasFetched}
          isEmpty={isEmptyObject(runtime)}
          emptyView={
            <DataNotFound
              label="Runtime configuration not found"
              explanation="To collect this information, run the application with connected Traceo SDK."
            />
          }
        >
          <Descriptions>
            {Object.entries(runtime).map(([settingName, settingValue], index) => (
              <>
                <DescriptionRow
                  key={index}
                  className="text-yellow-500 font-semibold"
                  label={settingName}
                >
                  {""}
                </DescriptionRow>

                {Object.entries(settingValue).map(([childName, childValue]) => (
                  <DescriptionRow key={index} className="ml-5" label={childName}>
                    {childValue}
                  </DescriptionRow>
                ))}
              </>
            ))}
          </Descriptions>
        </ConditionLayout>
      </PagePanel>
    </AppExploreNavigationPage>
  );
};

export default AppRuntimePage;
