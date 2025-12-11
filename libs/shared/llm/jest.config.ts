export default {
  displayName: 'shared-llm',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/shared/llm',
  moduleNameMapper: {
    '^@bizflow/shared/types$': '<rootDir>/../../types/src/index.ts',
    '^@bizflow/shared/llm$': '<rootDir>/src/index.ts',
  },
};

