import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository
    );
  });

  it("should be able to edit own question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("author-01"),
      },
      new UniqueEntityID("question-01")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      })
    );

    const result = await sut.execute({
      authorId: "author-01",
      questionId: newQuestion.id.toValue(),
      title: "Updated Title",
      content: "Updated Content",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "Updated Title",
      content: "Updated Content",
    });

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toHaveLength(2);

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
    ]);

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
      questionId: newQuestion.id.toValue(),
      title: "Updated Title",
      content: "Updated Content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
