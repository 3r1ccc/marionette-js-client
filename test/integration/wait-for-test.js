suite('scope', function() {
  var client = marionette.client();

  suite('sync waitFor', function() {
    test('should not yield in sync code', function() {
      var tries = 0;
      var succeed = 10;

      var i = 1;
      // short signature
      client.waitFor(function() {
        return (++tries === succeed);
      });

      assert.strictEqual(tries, 10);
    });

    test('should eventually timeout', function() {
      var timeout = 450;
      var start = Date.now();
      var err;
      try {
        client.waitFor(function() {
          return false;
        }, { timeout: timeout });
      } catch (e) {
        err = e;
      }

      assert.ok(err);
      assert.operator(Date.now() - start, '>=', timeout);
    });

    test('should do the mocha sync', function() {
      var tries = 0, success = 3;
      client.waitFor(function fn(waitForComplete) {
        tries += 1;
        if (tries === success) {
          waitForComplete(null, true);
        }

        setTimeout(fn.bind(this, waitForComplete), 10);
      });

      assert.strictEqual(tries, success);
    });

    test('should do the mocha fail sync', function(done) {
      var err = new Error('failure!');
      try {
        client.waitFor(function(waitForComplete) {
          waitForComplete(err);
        });
      } catch (e) {
        assert.strictEqual(e, err);
        done();
      }
    });
  });

  suite('async wait for calls', function() {
    test('should throw an error when given', function(done) {
      var err = new Error('failure!');
      client.waitFor(function(waitForComplete) {
        waitForComplete(err);
      }, function(e) {
        assert.strictEqual(e, err);
        done();
      });
    });

    test('should fire when async condition is met', function(done) {
      var tries = 0;
      var success = 3;
      client.waitFor(function() {
        return ++tries === success;
      }, function() {
        assert.strictEqual(tries, 3);
        done();
      });
    });
  });
});
