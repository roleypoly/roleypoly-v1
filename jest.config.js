module.exports = {
  testMatch: ['**/*.test.js'],
  verbose: true,
  bail: true,
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ]
}
