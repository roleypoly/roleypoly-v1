module.exports = {
  preset: "ts-jest",
  verbose: true,
  bail: true,
  jsx: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  transform: {
    ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
}
