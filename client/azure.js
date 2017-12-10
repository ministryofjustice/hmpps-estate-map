import httpism from "httpism";

const azure = httpism.client({
  cookies: true,
  responseBody: "json"
});

const SUBS = "/azure/subscriptions";
const SUB = SUBS + "/:subscriptionId";
const NICS = SUB + "/providers/Microsoft.Network/networkInterfaces";

export function refreshToken() {
  return azure.get("/.auth/refresh");
}

export function getSubscriptions() {
  return azure
    .get(SUBS, {
      params: { "api-version": "2015-01-01" }
    })
    .then(body => body.value);
}

/**
 * We'll use the NICs API as we only actually care about IPs and names
 */
export function getVMList(subscriptionId) {
  return azure
    .get(NICS, {
      params: {
        subscriptionId,
        "api-version": "2017-09-01"
      }
    })
    .then(body => body.value.map(nicToVmSummary));
}

function nicToVmSummary(nic) {
  const { id, properties } = nic;
  const ipConfig = properties.ipConfigurations[0];
  return {
    id,
    name: resourceId(properties.virtualMachine),
    ip: ipConfig.properties.privateIPAddress,
    subnet: resourceId(ipConfig.properties.subnet)
  };
}

function resourceId(resource) {
  if (resource && resource.id) {
    return resource.id.substring(resource.id.lastIndexOf("/") + 1);
  } else {
    return "<none>";
  }
}
