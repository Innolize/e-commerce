// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testPathIgnorePatterns: ["<rootDir>/dist"],
  //setupFiles: [
  //  "<rootDir>/jest/setEnvVars.js"
  //]
  // transformIgnorePatterns: ['^.+\\.js$']
};