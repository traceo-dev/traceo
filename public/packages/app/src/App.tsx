import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./assets/styles/main.css";
import "@traceo/ui/dist/styles.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SocketContext, socket } from "./core/hooks/SocketContextProvider";
import { RouteDescriptor } from "@traceo/types";
import { getAppRoutes } from "./routes/routes";
import { Suspense } from "react";
import { PageCenter } from "./core/components/PageCenter";
import Maintenance from "./core/components/Layout/Pages/Maintenance";
import { NavBar } from "./core/components/Layout/Navbar";
import { TraceoLoading } from "./core/components/TraceoLoading";
import { DashboardHeader } from "./core/components/Layout/DashboardHeader";
import { Page } from "./core/components/Page";
import { MainViewWrapper } from "./core/components/Layout/Wrappers/MainViewWrapper";
import { NotificationContainer } from "./core/components/Notification/NotificationContainer";
import { persistedRedux, store } from "./store";

export const App = () => {
  const renderRoute = (route: RouteDescriptor) => {
    let element = (
      <Page>
        <route.component />
      </Page>
    );

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

  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistedRedux}>
          <SocketContext.Provider value={{ socket }}>
            <BrowserRouter>
              <div className="flex flex-col">
                <DashboardHeader />
                <NotificationContainer />
                <div className="flex items-strech absolute w-full h-full top-0 left-0">
                  <NavBar />
                  <MainViewWrapper>{renderRoutes()}</MainViewWrapper>
                </div>
              </div>
            </BrowserRouter>
          </SocketContext.Provider>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
