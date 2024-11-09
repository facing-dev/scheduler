/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset:'ts-jest',
  resolver:"./jest/resolver.cjs",
  // testEnvironment: 'node',
  testMatch:["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest",{
      tsconfig:'tsconfig/tsconfig.jest.json'
    }],
  },
};