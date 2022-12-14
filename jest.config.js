/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/day*/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', 'templates'],
};