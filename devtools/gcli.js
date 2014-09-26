'use strict';

const { Cu } = require('chrome');
const { when: unload } = require('sdk/system/unload');

try {
  // Starting with FF 23, gcli.jsm moved to another location
  Cu.import("resource://gre/modules/devtools/gcli.jsm");
} catch(e) {
  try {
    Cu.import("resource:///modules/devtools/gcli.jsm");
  } catch(e) {
    console.error("Unable to load gcli.jsm");
  }
}

console.log(Object.keys(gcli))

function addCommand(cmd) {
  let name = cmd.name;
  gcli.addCommand(cmd);
  unload(gcli.removeCommand.bind(gcli, name));
}
exports.addCommand = addCommand;

function hasCommand(cmd) {
  return (gcli.getCommand(cmd.name || cmd) === undefined);
}
exports.hasCommand = hasCommand;

exports.removeCommand = gcli.removeCommand;
