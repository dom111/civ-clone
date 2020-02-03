export default (name, testProvider) => {
  const tests = testProvider(),
    results = tests.map(([value, check, label = false], i) =>
      (value === check) || `${label ? `'${label}'` : `Test ${i + 1}`} failed - ${value} !== ${check}.`
    )
  ;

  const failedTests = results.filter((result) => result !== true),
    totalTests = tests.length,
    successfulTests = totalTests - failedTests.length
  ;

  failedTests.forEach((result) => console.log(`\x1b[31m${name}: ${result}\x1b[0m`));

  if (successfulTests !== totalTests) {
    console.log('\n');
  }

  console.log(`\x1b[${
    successfulTests > 0 ?
      successfulTests < totalTests ?
        '33' :
        '32' :
      '31'
  }m${name}: ${successfulTests}/${totalTests} test${tests.length === 1 ? '' : 's'} passed.\x1b[0m`);
};
