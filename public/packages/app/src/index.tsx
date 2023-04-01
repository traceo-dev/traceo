import App from "./App";
import { configureApi } from "./core/lib/api";
import ReactDOM from "react-dom";
import { TraceoClient } from "@traceo-sdk/react";

const init = () => {
  try {
    configureApi();

    ReactDOM.render(<App />, document.getElementById("root"));
  } catch (error) {
    console.error("Failed to start app. Caused by: ", error);
  }
};

init();
