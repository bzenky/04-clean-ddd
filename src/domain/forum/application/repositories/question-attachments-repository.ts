import { QuestionAttachment } from "../../enterprise/entities/answer-comment";

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(QuestionId: string): Promise<QuestionAttachment[]>;
}
