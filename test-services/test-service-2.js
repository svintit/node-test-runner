const assert = require('assert')
const http = require('../http')
const output = require('../output')

class TestService2 {
  async testGetEventsSuccess () {
    var resp = await http.request('GET', `events`)
    output.title('Service2 - GET Events Success')

    resp.body = JSON.parse(resp.body)

    http.runAssertions(resp, [
      () => assert.equal(resp.statusCode, 200),
      () => assert.equal(resp.body instanceof Array, true),
      () => assert.equal(resp.body.length > 0, true),
    ])
  }
}

module.exports = TestService2