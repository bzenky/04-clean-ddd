import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface NotificationProps {
  title: string;
  content: string;
  createdAt: Date;
  readAt?: Date;
  recipientId: UniqueEntityID;
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get readAt() {
    return this.props.readAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<NotificationProps, "createdAt">,
    id?: UniqueEntityID
  ): Notification {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return notification;
  }
}
