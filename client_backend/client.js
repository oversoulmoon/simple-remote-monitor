const net = require("net");
const { createServer } = require("http");
const os = require("os");
const express = require("express");
const cors = require("cors");
const port = 5782;
const { Server } = require("socket.io");
const Socket = net.Socket;
var app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    mrthogs: ["POST", "GET"],
  },
});
io.on("connection", (socket) => {
  console.log("connected with", socket.id);
  socket.on("disconnect", () => {
    console.log("disconnected with", socket.id);
  });
  socket.on("get_clients", () => {
    console.log("{get_clients} requested from", socket.id);
    var promises = [];
    // console.log(getMasterIPList);
    getMasterIPList().map((IP) => {
      promises.push(
        new Promise((resolve, reject) => {
          var socket = new Socket();
          socket.on("connect", () => {
            resolve(IP);
          });
          socket.connect(port, IP);
          socket.on("error", (e) => {});
          setTimeout(() => {
            socket.end();
            resolve();
          }, 500);
        })
      );
    });
    Promise.all(promises).then((results) => {
      var clients = results.filter((data) => {
        return data !== undefined;
      });
      console.log(clients);
      socket.emit(
        "clients",
        JSON.stringify({
          clients: clients,
        })
      );
    });
  });
});

server.listen(5000);
console.log("client front end listening on port 5000...");
function getMasterIPList() {
  var interfaces = getNetMasks();
  var IPList = [];
  interfaces.forEach((value) => {
    IPList = IPList.concat(
      getIPList(getIPRange({ IP: value.IP, NetMask: value.NetMask }))
    );
  });
  return IPList;
}
/**
 * @param {{start: [], end:[]}} IPRange
 */
function getIPList(IPRange) {
  var results = [];
  for (var i = 0; i < IPRange.start.length - 1; i++) {
    if (IPRange.start[i] < IPRange.end[i]) {
      var startC = IPRange.start.slice();
      var endC = IPRange.end;
      startC[i] = startC[i] + 1;
      results = results.concat(getIPList({ start: startC, end: endC }));
    }
  }
  if (IPRange.end.at(-1) > IPRange.start.at(-1)) {
    for (var i = IPRange.start.at(-1); i <= IPRange.end.at(-1); i++) {
      var currIP = "";
      for (var z = 0; z < IPRange.start.length - 1; z++) {
        currIP += IPRange.start[z] + ".";
      }
      currIP += i;
      results.push(currIP);
    }
  }
  return results;
}
function pingIP(IP) {
  return new Promise((resolve, reject) => {
    var socket = new Socket(),
      status = false;
    socket.on("connect", () => {
      console.log(IP, "VALID IP, DEVICE FOUND");
      resolve(IP);
    });
    socket.setTimeout(500);
    socket.connect(port, IP);
    socket.on("error", (e) => {
      console.log(IP, "not valid");
    });
  });
}

function getNetMasks() {
  var interfaces = os.networkInterfaces();
  var result = [];
  for (var names in interfaces) {
    if (names !== "lo") {
      var currInterface = {};
      var info = interfaces[names];
      for (var i = 0; i < info.length; i++) {
        if (info[i].family === "IPv4") {
          currInterface["IP"] = info[i]["address"];
          currInterface["cidr"] = info[i]["cidr"];
          currInterface["NetMask"] = info[i]["netmask"];
        }
      }
      result.push(currInterface);
    }
  }
  return result;
}
/**
 *
 * @param {{IP:"",NetMask:""}} IP
 * @returns {{start:"", end:""}}
 */
function getIPRange(IP) {
  var result = { start: new Array(4), end: new Array(4) };
  var netmask = IP.NetMask.split(".");
  var ip = IP.IP.split(".");
  for (var i = 0; i < netmask.length; i++) {
    if (netmask[i] === "255") {
      result.start[i] = parseInt(ip[i]);
      result.end[i] = parseInt(ip[i]);
    } else {
      result.start[i] = 1;
      result.end[i] = 254;
    }
  }
  return result;
}
// Create a socket (client) that connects to the server
/**
 *
 * @param {String} bin
 */
function binaryToDec(bin = "") {
  bin = bin.replace(" ", "");
  total = 0;
  var length = bin.length;
  for (var i = length - 1; i >= 0; i--) {
    total += parseInt(bin[i] * Math.pow(2, length - 1 - i));
  }
  return total;
}
