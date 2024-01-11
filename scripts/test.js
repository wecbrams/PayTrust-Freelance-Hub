'use strict';
// Set test environment variables
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.

// Crash on unhandled rejections
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const jest = require('jest');
const execSync = require('child_process').execSync;
let argv = process.argv.slice(2);

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Watch unless on CI or explicitly running all tests
if (
  !process.env.CI &&
  argv.indexOf('--watchAll') === -1 &&
  argv.indexOf('--watchAll=false') === -1
) {
  // https://github.com/facebook/create-react-app/issues/5210
  const hasSourceControl = isInGitRepository() || isInMercurialRepository();
  argv.push(hasSourceControl ? '--watch' : '--watchAll');
}

// Ensure that the test suite covers a sufficient number of scenarios.

// Example:
// Test Suite Improvement: Add more test cases to cover edge cases and different scenarios.
test('calculateTotalPayment function', () => {
  // Test case 1: Regular scenario
  expect(calculateTotalPayment(20, 10, 0, 0)).toBe(200);

  // Test case 2: With bonuses
  expect(calculateTotalPayment(20, 10, 50, 0)).toBe(250);

  // Test case 3: With deductions
  expect(calculateTotalPayment(20, 10, 0, 30)).toBe(170);

  // ... add more test cases ...
});

jest.run(argv);
