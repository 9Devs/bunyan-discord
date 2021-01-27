module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    resetModules: true,
    verbose: true,
    moduleFileExtensions: [
        'js',
        'json',
        'ts'
    ],
    testRegex: [
        '(/tests/.*|(\\.|/)(test|spec))\\.ts?$',
    ],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    coverageDirectory: 'test-results',
    testEnvironment: 'node'
}
