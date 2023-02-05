"use strict";

const os = require("os");
const TEST = false;
const totalMem = byteToMib(os.totalmem());

function getMem() {
  var freeMem = byteToMib(os.freemem());
  return { used: totalMem - freeMem, total: totalMem };
}
function byteToMib(byte) {
  return Math.round(byte / 1024 / 1024);
}
if (TEST) {
  const assertEqual = require("./test.js");
  assertEqual(byteToMib(1024), 0);
  assertEqual(byteToMib(1024 * 1024), 1);
  assertEqual(byteToMib(1024 * 1024 * 1024), 1024);
  assertEqual(byteToMib(1024 * 1024 * 1024 * 1024), 1024 * 1024);
}
module.exports = getMem;
