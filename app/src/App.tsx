import { Route, Routes, BrowserRouter } from "react-router-dom";
import "antd/dist/antd.min.css";
import "./assets/styles/main.css";
import { Provider } from "react-redux";
import { SocketContext, socket } from "./core/hooks/SocketContextProvider";
import { store } from "./store/store";
import { RouteDescriptor } from "./types/navigation";
import { getAppRoutes } from "./routes/routes";
import { Suspense } from "react";
import { PageCenter } from "./core/components/PageCenter";
import Maintenance from "./core/components/Layout/Pages/Maintenance";
import { MainViewWrapper } from "./core/components/Layout/MainViewWrapper";
import { NavBar } from "./core/components/Layout/Navbar";
import { TraceoLoading } from "./core/components/TraceoLoading";

export const App = () => {
  const renderRoute = (route: RouteDescriptor) => {
    return <Route path={route.path} key={route.path} element={<route.component />} />;
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
      <Suspense fallback={<TraceoLoading />}>
        <Routes>{getAppRoutes().map((r) => renderRoute(r))}</Routes>
      </Suspense>
    );
  };

  return (
    <>
      <div className="App">
        <Provider store={store}>
          <SocketContext.Provider value={{ socket }}>
            <BrowserRouter>
              <div className="traceo-app">
                <NavBar />
                <MainViewWrapper>{renderRoutes()}</MainViewWrapper>
              </div>
            </BrowserRouter>
          </SocketContext.Provider>
        </Provider>
      </div>
      <style>{`
      .traceo-app {
        display: flex;
        -webkit-box-align: stretch;
        align-items: stretch;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
      }
    `}</style>
    </>
  );
};

export default App;
