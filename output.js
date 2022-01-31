exports.passed = (i) => console.log('\x1b[32m%s\x1b[0m', `--- Assertion ${i}: PASSED ---`)
exports.failed = (i) => console.log('\x1b[31m%s\x1b[0m', `--- Assertion ${i}: FAILED ---`)
exports.title = (title) => {
  const colour = '\x1b[34m%s\x1b[0m'
  console.log()
  console.log(colour, '='.repeat(title.length + 8))
  console.log(colour, '=== ' + title + ' ===')
  console.log(colour, '='.repeat(title.length + 8))
}
exports.parseTotalOutput = (passed, failed, colour) => {
  console.log("\n")
  const out = `===================== ${passed}/${passed+failed} Assertions Passed =====================`
  console.log(colour, '='.repeat(out.length))
  console.log(colour, out)
  console.log(colour, '='.repeat(out.length))
}