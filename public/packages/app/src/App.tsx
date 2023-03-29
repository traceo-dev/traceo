import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./assets/styles/main.css";
import "@traceo/ui/dist/styles.css";
import Maintenance from "./core/components/Layout/Pages/Maintenance";
import { NotificationContainer } from "./core/components/Notification/NotificationContainer";
import { PageCenter } from "./core/components/PageCenter";
import { TraceoLoading } from "./core/components/TraceoLoading";
import { ConfigsContextProvider } from "./core/contexts/ConfigsContextProvider";
import { RouteDescriptor } from "./core/types/navigation";
import { getAppRoutes } from "./routes/routes";
import { persistedRedux, store } from "./store";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { LiveContextProvider } from "./core/contexts/LiveContextProvider";
import Header from "./core/components/Layout/Header";
import { TraceoAppWrapper } from "./core/components/Layout/Wrappers/TraceoAppWrapper";

export const App = () => {
  const renderRoute = (route: RouteDescriptor) => {
    let element = <route.component />;

    if (route.wrapper) {
      element = (
        <route.wrapper>
          <route.component />
        </route.wrapper>
      );
    }

    return <Route path={route.path} key={route.path} element={element} />;
  };

  const renderRoutes = () => {
    if (process.env.REACT_APP_MAINTENANCE === "true") {
      return (
        <PageCenter>
          <Maintenance />
        </PageCenter>
      );
    }

    return (
      <Suspense
        fallback={
          <PageCenter>
            <TraceoLoading />
          </PageCenter>
        }
      >
        <Routes>{getAppRoutes().map((r) => renderRoute(r))}</Routes>
      </Suspense>
    );
  };

  const renderHeader = () => {
    const paths = window.location.pathname.split("/");
    if (!paths.includes("project") && !paths.includes("dashboard")) {
      return null;
    }

    return <Header />;
  };

  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistedRedux}>
          <BrowserRouter>
            <ConfigsContextProvider>
              <LiveContextProvider>
                <div className="flex flex-col">
                  {renderHeader()}
                  <NotificationContainer />
                  <TraceoAppWrapper>{renderRoutes()}</TraceoAppWrapper>
                </div>
              </LiveContextProvider>
            </ConfigsContextProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
