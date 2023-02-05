"use strict";

const os = require("os");
const TEST = false;
// var interfaces = os.networkInterfaces();
// console.log(interfaces);

/*
    given that the network object is 
         [{
            name: str,
            IPv4: [{
                IP: str,
                MAC: str
            }],
            IPv6: [{
                IP: str,
                MAC: str
            }],
            usage: {TX: int, RX: int},
            totalUsage: {TX: int, RX: int}
         }]
    to get initial pass null in both. 
*/
function getUsage(network, date) {
  var seconds = (new Date() - Date.parse(date)) / 1000;
  var result = getInterfaceInfo();
  for (var i = 0; i < result.length; i++) {
    var temp = isIn(result[i].name, network);
    result[i]["totalUsage"] = getTotalTraffic(result[i].name);
    var speed = { TX: 0, RX: 0 };
    if (temp) {
      speed.TX = Math.round(
        Math.abs(temp.TX - result[i].totalUsage.TX) / seconds
      );
      speed.RX = Math.round(
        Math.abs(temp.RX - result[i].totalUsage.RX) / seconds
      );
    }
    result[i]["usage"] = speed;
  }
  return result;
}

function getInterface(interfaceName) {
  const exec = require("child_process").execSync;
  var interfaces = exec("ifconfig -a", { encoding: "utf-8" }).split("\n\n");
  for (var inf in interfaces) {
    if (interfaces[inf].startsWith(interfaceName)) {
      return interfaces[inf];
    }
  }
  return null;
}
function getTotalTraffic(interfaceName) {
  var networkInterface = getInterface(interfaceName).split("\n");
  if (networkInterface) {
    var result = {};
    for (var i = 0; i < networkInterface.length; i++) {
      var line = networkInterface[i].trim();
      if (line.startsWith("TX") && !line.includes("error")) {
        var start = line.indexOf("bytes") + 6;
        result["TX"] = parseInt(
          line.substring(start, line.indexOf(" ", start))
        );
      } else if (line.startsWith("RX") && !line.includes("error")) {
        var start = line.indexOf("bytes") + 6;
        result["RX"] = parseInt(
          line.substring(start, line.indexOf(" ", start))
        );
      }
    }
  }
  return result;
}
function isIn(name, network) {
  if (network) {
    for (var i = 0; i < network.length; i++) {
      if (network[i]["name"] === name) {
        return network[i]["totalUsage"];
      }
    }
  }
  return false;
}
function getInterfaceInfo() {
  var interfaces = os.networkInterfaces();
  var result = [];
  for (var names in interfaces) {
    var currInterface = {};
    currInterface["name"] = names;
    var info = interfaces[names];
    var ipv4 = [];
    var ipv6 = [];
    for (var i = 0; i < info.length; i++) {
      if (info[i].family === "IPv4") {
        ipv4.push({ IP: info[i]["cidr"], MAC: info[i]["mac"] });
      } else if (info[i].family === "IPv6") {
        ipv6.push({ IP: info[i]["cidr"], MAC: info[i]["mac"] });
      }
    }
    currInterface["IPv4"] = ipv4;
    currInterface["IPv6"] = ipv6;
    result.push(currInterface);
  }
  return result;
}

if (TEST) {
  var past = new Date();
  var pastn = getUsage(null, past);
  console.log(pastn);
  setTimeout(() => {
    console.log(getUsage(pastn, past));
  }, 10000);
}

module.exports = getUsage;
