import { expect, test } from "vitest"
import { Slug } from "./slug"

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Example question title')

  expect(slug.value).toEqual('example-question-title')

  const slugWithSpecialCharacters = Slug.createFromText('Test with special characters çãó')

  expect(slugWithSpecialCharacters.value).toEqual('test-with-special-characters-cao')
})