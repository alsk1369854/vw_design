const config = {
  verbose: true,
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  testRegex: ".test.(tsx?)$",
  transform: {
    "^.+\\.(j|t)sx?$": "ts-jest",
    '^.+\\.tsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ["/node_modules/(?!@react-dnd|react-dnd|dnd-core|react-dnd-html5-backend)"],
};

// const config = {
//   preset: "ts-jest",
//   testEnvironment: "jsdom",
//   moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
//   testPathIgnorePatterns: ["/node_modules/"],
//   testRegex: ".*.(test|spec).(j|t)s[x]?$",
//   transform: {
//       "node_modules/(react-dnd|dnd-core|@react-dnd)/.+\\.(j|t)sx?$": "ts-jest",
//       "^.+\\.js$": "babel-jest",
//   },
//   transformIgnorePatterns: [`/node_modules/(?!(somePkg)|react-dnd|dnd-core|@react-dnd)`],
// };

// module.exports = config;