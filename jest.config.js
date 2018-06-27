const ALWAYS_IGNORE = [
  '<rootDir>/dist',
  '/node_modules/'
];

const EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'node'];

module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ALWAYS_IGNORE,
  coveragePathIgnorePatterns: ALWAYS_IGNORE,
  testRegex: `^.+\\.spec.(${EXTENSIONS.join('|')})$`,
  moduleFileExtensions: EXTENSIONS,
  transform: {
    [`^.+\\.(${EXTENSIONS.join('|')})$`]: 'babel-jest'
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
