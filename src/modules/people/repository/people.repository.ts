import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { PeopleEntity } from '../domains/schemas/people.schema';

@Injectable()
export class PeopleRepository {
  constructor(
    @InjectRepository(PeopleEntity, 'mongodbConnection')
    private readonly peopleRepository: MongoRepository<PeopleEntity>,
  ) {}

  async getPeopleById(id: number) {
    const item = await this.peopleRepository.findOne({
      where: {
        tmdb_id: id,
      },
    });

    return { item };
  }
}
