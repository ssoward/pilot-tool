module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src/tests'
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^../src/(.*)$': '<rootDir>/src/$1' // Adjust if your app import paths are different
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/controllers/**/*.ts',
    'src/routes/**/*.ts',
    // Add other relevant paths, exclude models if they are just data structures or config files
    '!src/models/**/*.ts', 
    '!src/config/**/*.ts',
    '!src/index.ts' // Exclude main server entry point if it's mostly setup
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8", // or "babel"

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    "json",
    "text",
    "lcov",
    "clover"
  ],

  // Setup files after env
  // setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'], // if you have a setup file
};
