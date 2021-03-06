(function(module) {

  function MockDriver() {
    this.sent = [];
    this.queue = [];
  }

  MockDriver.prototype = {

    connectionId: 0,

    reset: function() {
      this.sent.length = 0;
      this.queue.length = 0;
    },

    send: function(cmd, cb) {
      this.sent.push(cmd);
      this.queue.push(cb);
    },

    respond: function(cmd) {
      if (this.queue.length) {
        (this.queue.shift())(cmd);
      }
    }
  };

  module.exports = MockDriver;

}.apply(
  this,
  (this.Marionette) ?
    [Marionette('support/mock-driver'), Marionette] :
    [module, require('../../lib/marionette/marionette')]
));
