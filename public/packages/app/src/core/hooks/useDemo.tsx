import { useConfig } from "../contexts/ConfigsContextProvider";

export const useDemo = () => {
  const config = useConfig();
  return config.demoMode && !config?.user?.admin;
};
