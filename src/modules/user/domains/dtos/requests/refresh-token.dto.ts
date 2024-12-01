import { StringField } from '../../../../../decorators';

export class RefreshTokenBody {
  @StringField({
    example: `eynkasaksdnasdasdkasdsad`,
  })
  token!: string;
}
