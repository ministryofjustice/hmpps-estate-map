import React from "react";

export default class SubscriptionPicker extends React.Component {
  state = { subscriptions: null };
  componentDidMount() {
    this.props.azure
      .getSubscriptions()
      .then(subscriptions => this.setState({ subscriptions }));
  }
  render() {
    const { onChange } = this.props;
    const { subscriptions } = this.state;
    return (
      <select onChange={({ target: { value } }) => onChange(value)}>
        {!subscriptions ? (
          <option value="">Loading...</option>
        ) : (
          <option value="">Select...</option>
        )}
        {subscriptions &&
          subscriptions.map(sub => (
            <option key={sub.subscriptionId} value={sub.subscriptionId}>
              {sub.displayName}
            </option>
          ))}
      </select>
    );
  }
}
