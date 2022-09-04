import { Route, Routes, BrowserRouter } from "react-router-dom";
import "antd/dist/antd.min.css";
import "./assets/styles/main.css";
import { Provider } from "react-redux";
import { SocketContext, socket } from "./core/hooks/SocketContextProvider";
import { store } from "./store/store";
import { RouteDescriptor } from "./types/navigation";
import { getAppRoutes } from "./routes/routes";
import { Suspense } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { PageCenter } from "./core/components/PageCenter";
import Maintenance from "./core/components/Layout/Pages/Maintenance";

export const App = () => {
  const renderRoute = (route: RouteDescriptor) => {
    return (
      //check here for roles in the future
      <Route path={route.path} key={route.path} element={<route.component />} />
    );
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
            <LoadingOutlined />
          </PageCenter>
        }
      >
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
              <div className="klepper-app">
                <main className="main-view">{renderRoutes()}</main>
              </div>
            </BrowserRouter>
          </SocketContext.Provider>
        </Provider>
      </div>
      <style>{`
        .main-view {
          position: relative;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          height: 100%;
          flex: 1 1 0;
          background-color: var(--color-bg-canvas) !important;
        }
        
        .klepper-app {
          display: flex;
          align-items: stretch;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      `}</style>
    </>
  );
};

export default App;
