import { ServiceAccount } from './service-account.dto';

export class GoogleAccount extends ServiceAccount {
  constructor(email: string, avatar: string) {
    super(email, avatar);
  }
}
