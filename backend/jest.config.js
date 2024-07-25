/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testTimeout: 30000, // Set timeout to 30 seconds (30000 ms)
  };
  