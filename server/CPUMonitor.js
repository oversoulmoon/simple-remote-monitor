"use strict";

const os = require("os");
const TEST = false;

function getUsage(cpus) {
  var wantedStats = ["user", "sys", "idle"];
  var usage = [];
  var currCPUS = os.cpus();
  for (var i = 0; i < currCPUS.length; i++) {
    var stats = { user: 0, sys: 0, idle: 0 };
    if (cpus) {
      var data = differenceBetweenTicks(cpus[i].times, currCPUS[i].times);
      usage = cpus[i].usage;
      if (usage.length >= 10) {
        usage = usage.splice(1, 10);
      }
      if (data["total"]) {
        for (var z = 0; z < wantedStats.length; z++) {
          stats[wantedStats[z]] = parseFloat(
            ((data[wantedStats[z]] / data["total"]) * 100).toFixed(1)
          );
        }
      }
    }
    currCPUS[i]["usage"] = usage.concat(stats);
  }
  return currCPUS;
}

function differenceBetweenTicks(cpu1, cpu2) {
  var result = {};
  var total = 0;
  for (var name in cpu1) {
    var difference = Math.abs(cpu1[name] - cpu2[name]);
    result[name] = difference;
    total += difference;
  }
  result["total"] = total;
  return result;
}
//

if (TEST) {
  var ns = getUsage(null);
  setTimeout(() => {
    console.log(getUsage(ns));
  }, 1000);
  const assertEqual = require("./test.js");
  for (var i = 0; i < 10; i++) {
    var num1 = Math.round(Math.random() * 100),
      num2 = Math.round(Math.random() * 100),
      num3 = Math.round(Math.random() * 100),
      num4 = Math.round(Math.random() * 100);
    var tick1 = {
      delta: num1,
      alpha: num2,
    };

    var tick2 = {
      delta: num3,
      alpha: num4,
    };
    var resultTick = {
      delta: Math.abs(num1 - num3),
      alpha: Math.abs(num2 - num4),
      total: Math.abs(num1 - num3) + Math.abs(num2 - num4),
    };
    assertEqual(differenceBetweenTicks(tick1, tick2), resultTick);
  }
}

module.exports = getUsage;
