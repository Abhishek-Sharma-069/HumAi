module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};