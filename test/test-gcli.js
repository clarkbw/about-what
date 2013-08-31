'use strict';

const { Loader } = require('sdk/test/loader');
const { addCommand: add,
        hasCommand: has,
        removeCommand: remove } = require('pathfinder/devtools/gcli');

exports.testCommand = function(assert) {
  assert.ok(!has('test'), 'the test command dne');
  assert.ok(!has({ name: 'test' }), 'the test command dne');

  add({
    name: 'test',
    exec: function() {}
  })

  assert.ok(has('test'), 'the test command does exist');
  assert.ok(has({ name: 'test' }), 'the test command does exist');

  remove('test');

  assert.ok(!has('test'), 'the test command dne');
  assert.ok(!has({ name: 'test' }), 'the test command dne');
};

exports.testCommandUnload = function(assert) {
  let loader = Loader(module);
  let gcli = loader.require('pathfinder/devtools/gcli');

  assert.ok(!has('test'), 'the test command dne');
  assert.ok(!has({ name: 'test' }), 'the test command dne');

  gcli.add({
    name: 'test',
    exec: function() {}
  });

  assert.ok(has('test'), 'the test command does exist');
  assert.ok(has({ name: 'test' }), 'the test command does exist');

  loader.unload();

  remove('test');

  assert.ok(!has('test'), 'the test command dne');
  assert.ok(!has({ name: 'test' }), 'the test command dne');
};

require('sdk/test').run(exports);
