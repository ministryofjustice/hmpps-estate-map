import React from "react";

export default class App extends React.Component {
  state = { subscriptions: null };
  componentDidMount() {
    fetch("/azure/subscriptions?api-version=2015-01-01")
      .then(res => res.json())
      .then(({ value: subscriptions }) => this.setState({ subscriptions }));
  }
  render() {
    const { subscriptions } = this.state;
    return (
      <div>
        <h1>Subscriptions</h1>
        <ul>
          {Array.isArray(subscriptions) &&
            subscriptions.map(sub => (
              <li key={sub.subscriptionId}>{sub.displayName}</li>
            ))}
        </ul>
      </div>
    );
  }
}
