export class SuccessResponse {
  message!: string;

  statusCode = 200;

  constructor(message: string) {
    this.message = message;
  }
}
