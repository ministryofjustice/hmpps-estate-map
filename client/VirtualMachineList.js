import React from "react";

import SubscriptionPicker from "./SubscriptionPicker";

export default class VirtualMachineList extends React.Component {
  state = { subscription: null };
  render() {
    const { azure } = this.props;
    const { subscription } = this.state;
    return (
      <div>
        <SubscriptionPicker
          azure={azure}
          onChange={subscription => this.setState({ subscription })}
        />
        <ActualVMList azure={azure} subscription={subscription} />
      </div>
    );
  }
}

class ActualVMList extends React.Component {
  state = { subscription: "", vms: null };
  componentDidMount() {
    this.load();
  }
  componentDidUpdate() {
    this.load();
  }
  load() {
    const { azure, subscription } = this.props;
    if (subscription === this.state.subscription) {
      return;
    }
    this.setState({ subscription });
    if (!subscription) {
      this.setState({ vms: null });
      return;
    }
    azure.getVMList(subscription).then(vms => this.setState({ vms }));
  }
  render() {
    const { subscription, vms } = this.state;
    if (!subscription) {
      return null;
    }
    if (!vms) {
      return <p>Loading...</p>;
    }
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>IP</th>
            <th>Subnet</th>
          </tr>
        </thead>
        <tbody>
          {vms.map(vm => (
            <tr key={vm.id}>
              <td>{vm.name}</td>
              <td>{vm.ip}</td>
              <td>{vm.subnet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
