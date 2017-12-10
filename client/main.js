import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import * as azure from "./azure";

ReactDOM.render(<App azure={azure} />, document.getElementById("app"));

if (module.hot) {
  module.hot.accept();
}
