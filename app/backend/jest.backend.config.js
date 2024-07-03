module.exports = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/**/*.test.js'], // Recursively find all test files
    setupFilesAfterEnv: ['<rootDir>/setup.js'], // Use setup.js in the root of the backend directory
  };
  