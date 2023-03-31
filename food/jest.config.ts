export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageProvider: "v8",
    root: '<root>/src/',
    testMatch: ['**/__test__/**/*.ts'],
    preset: 'ts-jest', //enables you to run your test in typescript
    testEnvironment: "jest-environment-node",
}