import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { makeQuestionComment } from "test/factories/make-question-comment";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to delete comment on question", async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete comment on question", async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    expect(() => {
      return sut.execute({
        questionCommentId: questionComment.id.toString(),
        authorId: "xablau",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
