import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '11',
      title: 'This is xablau',
      content: 'Lorem ipsum dolor sit amet, consectetur adip',
    })

    expect(question.id).toBeTruthy()
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(question.id)
  })
})
