module.exports = {
  preset: "ts-jest",
  verbose: true,
  bail: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
}
