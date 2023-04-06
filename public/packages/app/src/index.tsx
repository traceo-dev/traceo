import App from "./App";
import { configureApi } from "./core/lib/api";
import ReactDOM from "react-dom";
import { TraceoClient } from "@traceo-sdk/react";

const init = () => {
  try {
    configureApi();

    new TraceoClient("tr_3610e2b1-9624-48d6-baa5-37f3acf8bf45", {
      host: "http://localhost:3000",
      performance: true
    });

    ReactDOM.render(<App />, document.getElementById("root"));
  } catch (error) {
    console.error("Failed to start app. Caused by: ", error);
  }
};

init();
