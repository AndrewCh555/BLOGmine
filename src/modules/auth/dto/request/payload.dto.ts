import { User } from '@shared/models/user.model';

export class Payload {
  id: string;
  username: string;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
  }
}
