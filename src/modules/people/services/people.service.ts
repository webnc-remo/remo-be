import { Injectable, Logger } from '@nestjs/common';

import { handleError } from '../../../common/utils';
import { PeopleRepository } from '../repository/people.repository';

@Injectable()
export class PeopleService {
  public logger: Logger;

  constructor(private readonly peopleRepository: PeopleRepository) {
    this.logger = new Logger(PeopleService.name);
  }

  async getPeopleById(id: number) {
    try {
      const person = await this.peopleRepository.getPeopleById(id);

      return person;
    } catch (error) {
      throw handleError(this.logger, error);
    }
  }
}
