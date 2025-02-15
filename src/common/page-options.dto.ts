import { Order } from '../constants';
import {
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '../decorators';

export class PageOptionsDto {
  @EnumFieldOptional(() => Order, {
    default: Order.asc,
  })
  readonly order: Order = Order.asc;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @StringFieldOptional()
  readonly q?: string;

  @StringFieldOptional()
  readonly year?: string;

  @StringFieldOptional()
  readonly genre?: string;

  @StringFieldOptional()
  readonly rating?: string;

  @StringFieldOptional()
  readonly isLLM?: string;
}
