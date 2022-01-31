const http = require('../http')
const TestService1 = require('./test-service-1')
const TestService2 = require('./test-service-2')

const filter = process.argv[3]

var servicesRunning = true

async function ensureServiceRunningLocally (endpoint) {
  const resp = await http.request('GET', endpoint)
  if (resp === null || resp.body.startsWith('connect ECONNREFUSED')) {
    console.error('\n\x1b[31m%s\x1b[0m', `--- Please ensure ${endpoint} is running and reachable ---`)
    servicesRunning = false
  }
}

async function runner (testClass) {
  const propNames = Object.getOwnPropertyNames(testClass.prototype)
    .filter(propName => (propName !== 'constructor'))

  for (const prop of propNames) {
    await new testClass()[prop]()
  }
}

const tests = {
  service1: TestService1,
  service2: TestService2
}

async function run () {
  if (filter && filter !== 'all') {
    await runner(tests[filter])
    return
  }

  for (const test in tests) {
    await runner(tests[test])
  }
}

// Sequential checks and run()
// ensureServiceRunningLocally("www.google.com").then(
//   () => ensureServiceRunningLocally("www.google.com").then(
//     () => servicesRunning ? run().then(() => http.outputTotal()) : process.exit(1)
//   )
// )

run().then(() => http.outputTotal())