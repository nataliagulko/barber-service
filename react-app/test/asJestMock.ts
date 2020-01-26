export default function asJestMock<TResult>(func: (...args: any[]) => TResult) {
	return func as jest.Mock<TResult>
}
