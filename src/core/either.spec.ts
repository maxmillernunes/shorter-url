import { left, right, type Either } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success', () => {
  const result = doSomething(true)

  expect(result.isRight()).toEqual(true)
  expect(result.isLeft()).toEqual(false)
})

test('error', () => {
  const result = doSomething(false)

  expect(result.isRight()).toEqual(false)
  expect(result.isLeft()).toEqual(true)
})
