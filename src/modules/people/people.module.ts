import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PeopleController } from './controllers/people.controller';
import { PeopleEntity } from './domains/schemas/people.schema';
import { PeopleRepository } from './repository/people.repository';
import { PeopleService } from './services/people.service';

@Module({
  imports: [TypeOrmModule.forFeature([PeopleEntity], 'mongodbConnection')],
  controllers: [PeopleController],
  providers: [PeopleService, PeopleRepository],
  exports: [PeopleService],
})
export class PeopleModule {}
