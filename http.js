const { request } = require('http')
const { URLSearchParams } = require('url')
const output = require('./output')

const LambdaPort = 9000
const LambdaPath = '/2015-03-31/functions/function/invocations'

const parseRequestPath = requestPath => {
  const idx = requestPath.indexOf('?')
  return idx > -1
    ? [requestPath.substring(0, idx), Object.fromEntries(new URLSearchParams(requestPath.substring(idx)).entries())]
    : [requestPath, {}]
}

exports.request = async (httpMethod, requestPath, headers = {}, payload) => {
  try {
    const [path, queryStringParameters] = parseRequestPath(requestPath)
    const body = payload && payload instanceof Object ? JSON.stringify(payload, null, 2) : payload

    const data = {}
    const result = await new Promise((resolve, reject) => {
      const message = JSON.stringify({
        httpMethod,
        path,
        headers: {
          'content-type': body ? 'text/plain' : undefined,
          'content-length': body ? body.length : 0,
          ...headers
        },
        queryStringParameters,
        body,
        isBase64Encoded: false,
        requestContext: {
          elb: false
        }
      })
      const opts = {
        method: 'POST',
        host: 'localhost',
        path: LambdaPath,
        port: LambdaPort,
        headers: {
          'content-type': 'application/json'
        }
      }
      const req = request(opts, res => {
        const chunks = []
        res.on('data', chunk => chunks.push(chunk))
        res.on('end', () => {
          const response = JSON.parse(Buffer.concat(chunks).toString())
          if (response.isBase64Encoded) {
            response.body = Buffer.from(response.body, 'base64').toString()
          }
          data.statusCode = res.statusCode
          resolve(response)
        })
      })
      req.on('error', reject)
      req.write(message)
      req.end()
    })
    return { ...result, ...data }
  } catch (e) {
    return null
  }
}


var passed = 0
var failed = 0
exports.runAssertions = (resp, assertions) => {
  console.log("Response Body: ", resp.body)

  var i = 0
  for (assertion of assertions) {
    i++

    try {
      assertion()
      output.passed(i)
      passed++
    } catch (e) {
      console.error(e)
      output.failed(i)
      failed++
    }
  }
}

exports.outputTotal = () => {
  failed === 0 ? output.parseTotalOutput(passed, failed, '\x1b[32m%s\x1b[0m') : output.parseTotalOutput(passed, failed, '\x1b[31m%s\x1b[0m')
}