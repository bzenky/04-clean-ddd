import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionAttachmentList } from "@/domain/forum/enterprise/entities/question-attachment-list";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

interface EditQuestionUseCaseResponse {}

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      throw new Error("Question not found.");
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error("Unauthorized to edit this question.");
    }

    const currentQuestionsAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionsAttachments
    );

    const questionAttachments = attachmentsIds.map((id) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(id),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionsRepository.save(question);

    return {};
  }
}
