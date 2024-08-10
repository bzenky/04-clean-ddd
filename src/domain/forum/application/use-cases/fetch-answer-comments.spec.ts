import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-01"),
      })
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-01"),
      })
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-01"),
      })
    );

    const { answerComments } = await sut.execute({
      answerId: "answer-01",
      page: 1,
    });

    expect(answerComments).toHaveLength(3);
  });

  it("should be able to fetch paginated answer comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID("answer-01") })
      );
    }

    const { answerComments } = await sut.execute({
      answerId: "answer-01",
      page: 2,
    });

    expect(answerComments).toHaveLength(2);
  });
});
