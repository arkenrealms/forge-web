module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  preset: 'ts-jest',
  reporters: [
    'default',
    'jest-junit',
    [
      'jest-html-reporters',
      {
        publicPath: './test-results/',
        filename: 'unit.html',
        expand: true,
      },
    ],
  ],
  coverageReporters: ['text', 'cobertura', 'lcov'],
  coverageDirectory: '<rootDir>/coverage',
  setupFilesAfterEnv: ['./jest.unit.setup.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {},
  testMatch: ['**/__tests__/**/*.+(ts|js|tsx|jsx)', '**/?(*.)+(spec|test).+(ts|js|tsx|jsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  verbose: true,
}
