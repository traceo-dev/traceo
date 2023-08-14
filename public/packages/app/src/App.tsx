import "./assets/styles/main.css";
import "@traceo/ui/dist/styles.css";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import Maintenance from "./core/components/Layout/Pages/Maintenance";
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
import { AppWrapper } from "./core/components/App/AppWrapper";
import { QueryClient, QueryClientProvider, QueryCache } from "react-query";

const queryCache = new QueryCache();
const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

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

  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistedRedux}>
          <BrowserRouter>
            <ConfigsContextProvider>
              {/* <LiveContextProvider> */}
              <QueryClientProvider client={queryClient}>
                <AppWrapper>{renderRoutes()}</AppWrapper>
              </QueryClientProvider>
              {/* </LiveContextProvider> */}
            </ConfigsContextProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
