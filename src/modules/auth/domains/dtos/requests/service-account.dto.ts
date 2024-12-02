import { StringField, UUIDField } from '../../../../../decorators';

export class ServiceAccount {
  @StringField({
    example: 'tantran.300803@gmail.com',
    description: 'Email of Account',
  })
  email!: string;

  @UUIDField({
    example: 'f7b9b1b0-3b3b-4b3b-8b3b-3b3b3b3b3b3b',
    description: `avatar of Account`,
  })
  avatar!: string;

  constructor(email: string, avatar: string) {
    this.email = email;
    this.avatar = avatar;
  }
}
