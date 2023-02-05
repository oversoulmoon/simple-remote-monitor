"use strict";

const assert = require("assert");
const TEST = false;
function test(item1, item2) {
  if (typeof item1 === typeof item2) {
    if (isPrimitive(item1)) {
      return item1 === item2;
    }
    if (fieldsMatch(item1, item2)) {
      var equal = true;
      for (var field in item1) {
        equal = equal && item1[field] === item2[field];
      }
      return equal;
    }
  }
  return false;
}
function assertEqual(item1, item2) {
  var result = test(item1, item2);
  if (result) {
    console.log("TEST PASSED");
  } else {
    console.log("TEST FAILED");
    console.log(item1);
    console.log(item2);
  }
}
function isPrimitive(item) {
  if (item === Object(item)) {
    return false;
  }
  return true;
}
function fieldsMatch(item1, item2) {
  //This function assumes that the params are already objects
  var keys1 = Object.keys(item1);
  var keys2 = Object.keys(item2);
  var equal = true;
  if (keys1.length === keys2.length) {
    for (var i = 0; i < keys1.length; i++) {
      equal = equal && keys1[i] === keys2[i];
    }
  } else {
    return false;
  }
  return equal;
}
if (TEST) {
  assert.equal(fieldsMatch({ aa: 0, bb: 0 }, { aa: 0, bb: 0 }), true);
  assert.equal(fieldsMatch({ ab: 0, bb: 0 }, { aa: 0, bb: 0 }), false);
  assert.equal(fieldsMatch({ aa: 93, bb: 34 }, { aa: 1243, bb: 234 }), true);
  assert.equal(
    fieldsMatch({ asdfae: 0, asdfa: 621 }, { aqafa: 0, adfe: 0 }),
    false
  );

  assert.equal(isPrimitive(1), true);
  assert.equal(isPrimitive("sdfasd"), true);
  assert.equal(isPrimitive(new String("adfas")), false);
  assert.equal(isPrimitive({ szdf: "asdfa", adsfd: "asdfa" }), false);

  assert.equal(test(1, 1), true);
  assert.equal(test(1, 2), false);
  assert.equal(test("asdf", "asdf"), true);
  assert.equal(test("asdf0", "asdfaw"), false);
  assert.equal(test(2.341, 3.3241), false);
  assert.equal(test(3.13, 3.13), true);
  assert.equal(test({ test: 0, val1: 0 }, { test: 0, val1: 0 }), true);
  assert.equal(test({ test: 0, val1: 0 }, { test: 3, val1: 0 }), false);
  assert.equal(test({ fas: 0, val1: 0 }, { dfe: 0, val1: 0 }), false);
  assert.equal(
    test({ test: 0, val1: 0, adsf: "23" }, { test: 3, val1: 0 }),
    false
  );
}
module.exports = assertEqual;
