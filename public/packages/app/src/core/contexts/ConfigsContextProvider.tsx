import { TraceoLoading } from "../components/TraceoLoading";
import api from "../lib/api";
import { ApiResponse, ViewConfigData } from "@traceo/types";
import React, { useContext, useEffect, useState } from "react";

const initialConfigs: ViewConfigData = {
  demoMode: false,
  user: {},
  env: "development",
  navTree: []
};

export const ConfigContext = React.createContext<ViewConfigData>(initialConfigs);

export const ConfigsContextProvider = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [configs, setConfigs] = useState<ViewConfigData>(initialConfigs);

  useEffect(() => {
    const loadBootData = async () => {
      setLoading(true);

      await api
        .get<ApiResponse<ViewConfigData>>("/api/view/config")
        .then(({ data }) => {
          setConfigs(data);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    loadBootData();
  }, []);

  return (
    <ConfigContext.Provider value={configs}>
      {loading ? <TraceoLoading /> : children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
