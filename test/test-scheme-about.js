/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

const { Loader } = require('sdk/test/loader');
const tabs = require('sdk/tabs');

function openTabGetContent(url, callback) {
  tabs.open({
    url: 'about:test',
    inBackground: true,
    onReady: function(tab) {
      let worker = tab.attach({
        contentScript: 'self.port.emit(\'body\', document.body.innerHTML)'
      });
      worker.port.on('body', function(msg) {
        tab.close(function() {
          callback(msg);
        });
      });
    }
  });
}

exports.testAddAboutWhat = function*(assert) {
  const loader = new Loader(module);
  const { add } = loader.require('../index');

  add({
    what: 'test',
    url: 'data:text/html;charset=utf-8,<body>test</body>'
  });

  let msg = yield new Promise(resolve => {
    openTabGetContent('about:test', (msg) => {
      assert.equal(msg, 'test', 'about:test content is \'test\'');
      loader.unload();
      openTabGetContent('about:test', resolve);
    });
  });

  assert.notEqual(msg, 'test', 'about:test content is \'test\'');
};

require('sdk/test').run(exports);
