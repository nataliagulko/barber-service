const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$'

module.exports = {
	setupFilesAfterEnv: ['./jest/jest.setup.ts'],
	testRegex: TEST_REGEX,
	transform: {
		'^.+\\.tsx?$': 'babel-jest',
	},
	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
	transformIgnorePatterns: ['node_modules'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	collectCoverage: false,
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json',
		},
	},
	moduleNameMapper: {
		'\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
		'\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
	},
}
