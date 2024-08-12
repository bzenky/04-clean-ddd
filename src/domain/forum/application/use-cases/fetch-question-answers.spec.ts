import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Questions Answers", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it("should be able to fetch questions answers", async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("question-01"),
      })
    );

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("question-01"),
      })
    );

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("question-01"),
      })
    );

    const result = await sut.execute({
      questionId: "question-01",
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
    expect(result.isRight()).toBe(true);
  });

  it("should be able to fetch paginated questions answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID("question-01") })
      );
    }

    const result = await sut.execute({
      questionId: "question-01",
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
    expect(result.isRight()).toBe(true);
  });
});
