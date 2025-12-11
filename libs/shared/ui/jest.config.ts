export default {
  displayName: 'shared-ui',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shared/ui',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@bizflow/shared/ui$': '<rootDir>/src/index.ts',
  },
};

