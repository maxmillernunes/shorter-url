import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface UserProps {
  email: string;
  password: string;
}

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    const answer = new User(props, id);

    return answer;
  }
}
