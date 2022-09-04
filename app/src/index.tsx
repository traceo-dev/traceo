import ReactDOM from "react-dom";
import App from "./App";
import { configureApi } from "./core/lib/api";
import { configureStore } from "./store/configureStore";

const init = () => {
  try {
    configureApi();
    configureStore();

    ReactDOM.render(<App />, document.getElementById("root"));
  } catch (error) {
    console.error("Failed to start app. Caused by: ", error);
  }
};

init();
