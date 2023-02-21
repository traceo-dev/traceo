import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./assets/styles/main.css";
import "@traceo/ui/dist/styles.css";
import { DashboardHeader } from "./core/components/Layout/DashboardHeader";
import { NavBar } from "./core/components/Layout/Navbar";
import Maintenance from "./core/components/Layout/Pages/Maintenance";
import { MainViewWrapper } from "./core/components/Layout/Wrappers/MainViewWrapper";
import { NotificationContainer } from "./core/components/Notification/NotificationContainer";
import { Page } from "./core/components/Page";
import { PageCenter } from "./core/components/PageCenter";
import { TraceoLoading } from "./core/components/TraceoLoading";
import { ConfigsContextProvider } from "./core/contexts/ConfigsContextProvider";
import { SocketContext, socket } from "./core/contexts/SocketContextProvider";
import { RouteDescriptor } from "./core/types/navigation";
import { getAppRoutes } from "./routes/routes";
import { persistedRedux, store } from "./store";
import { Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

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
              <ConfigsContextProvider>
                <div className="flex flex-col">
                  <DashboardHeader />
                  <NotificationContainer />
                  <div className="flex items-strech absolute w-full h-full top-0 left-0">
                    <NavBar />
                    <MainViewWrapper>{renderRoutes()}</MainViewWrapper>
                  </div>
                </div>
              </ConfigsContextProvider>
            </BrowserRouter>
          </SocketContext.Provider>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
