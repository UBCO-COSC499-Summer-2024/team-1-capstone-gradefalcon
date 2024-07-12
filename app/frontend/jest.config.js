// jest.config.js
module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    moduleFileExtensions: ['js'],
    testMatch: [
      '**/__tests__/**/*.js?(x)',
      '**/?(*.)+(spec|test).js?(x)'
    ],
    transformIgnorePatterns: [
      '/node_modules/',
    ],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
    },
    preset: 'jest-playwright-preset',
    testMatch: ['**/tests/e2e/**/*.test.js'],
    testEnvironmentOptions: {
      // only string values is supported??
      beforeParse (window) {
       console.log('------------------------------------------  log ')
        window.document.childNodes.length === 0;
        window.alert = (msg) => { console.log(msg); };
        window.matchMedia = () => ({});
        window.scrollTo = () => { };
      }
    }, 
  };