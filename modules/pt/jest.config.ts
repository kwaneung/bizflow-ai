export default {
  displayName: 'pt',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/modules/pt',
  moduleNameMapper: {
    '^@bizflow/shared/types$': '<rootDir>/../../libs/shared/types/src/index.ts',
    '^@bizflow/shared/llm$': '<rootDir>/../../libs/shared/llm/src/index.ts',
    '^@bizflow/modules/pt$': '<rootDir>/src/index.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],
};

