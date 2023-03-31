import App from "./App";
import { configureApi } from "./core/lib/api";
import ReactDOM from "react-dom";
import { TraceoClient } from "@traceo-sdk/react";

const init = () => {
  try {
    configureApi();

    new TraceoClient({
      apiKey: "11abfb01-2c91-4b7d-9b39-3a220640fd37",
      projectId: "cMKsteC5H9l1cqs",
      url: "http://localhost:3000",
      performance: true
    });

    ReactDOM.render(<App />, document.getElementById("root"));
  } catch (error) {
    console.error("Failed to start app. Caused by: ", error);
  }
};

init();
