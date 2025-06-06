// jest.config.js (frontend - /Users/ssoward/sandbox/workspace/pilot-tool/jest.config.js)
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: [
    '<rootDir>/src'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$_': 'identity-obj-proxy', // Mock CSS imports
    '^axios$': '<rootDir>/src/__mocks__/axios.ts', // If you plan to mock axios globally
    '^@heroicons/react/24/outline$': '<rootDir>/src/__mocks__/heroicons.ts', // Mock heroicons
    // Add any other necessary module mappings here
    '^../components/forms/EmployeeForm$': '<rootDir>/src/components/forms/EmployeeForm.tsx',
    '^../types/Employee$': '<rootDir>/src/types/Employee.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: [
    "src/components/**/*.tsx",
    "src/pages/**/*.tsx",
    "!src/main.tsx",
    "!src/App.tsx",
    "!src/router.tsx",
    "!src/vite-env.d.ts",
    "!src/setupTests.ts",
    "!src/**/__mocks__/**",
    "!src/types/**" // Usually no need to cover type definition files
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: ['TS151001'] // Ignore specific TS diagnostic codes if necessary
      }
    }
  }
};
