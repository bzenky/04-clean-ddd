import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to edit own question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-01"),
      },
      new UniqueEntityID("question-01")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: "author-01",
      questionId: newQuestion.id.toString(),
      title: "Updated Title",
      content: "Updated Content",
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "Updated Title",
      content: "Updated Content",
    });
    expect(result.isRight()).toBe(true);
  });

  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-XX"),
      },
      new UniqueEntityID("question-01")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: "author-01",
      questionId: "question-01",
      title: "Updated Title",
      content: "Updated Content",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
