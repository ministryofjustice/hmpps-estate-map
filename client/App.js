import React from "react";

import VirtualMachineList from "./VirtualMachineList";

export default class App extends React.Component {
  state = { error: null };
  componentDidCatch(error, info) {
    this.setState({ error: error.stack + "\n" + info.componentStack });
  }
  render() {
    const { azure } = this.props;
    return (
      <div>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">
                HMPPS Azure Browser
              </a>
              <button
                type="button"
                className="btn btn-default navbar-btn navbar-right"
                onClick={() => azure.refreshToken()}
              >
                Refresh Token
              </button>
            </div>
          </div>
        </nav>
        <div className="container">
          {this.state.error ? (
            <div className="alert alert-danger">
              <h3>Error</h3>
              <pre>{this.state.error}</pre>
            </div>
          ) : (
            <VirtualMachineList azure={azure} />
          )}
        </div>
      </div>
    );
  }
}
