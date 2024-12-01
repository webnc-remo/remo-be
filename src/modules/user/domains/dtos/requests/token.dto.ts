import { StringField } from '../../../../../decorators';

export class TokenBody {
  @StringField({
    example: `eynkasaksdnasdasdkasdsad`,
  })
  token!: string;
}
