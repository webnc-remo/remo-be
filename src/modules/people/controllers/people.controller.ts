import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PublicRoute } from '../../../decorators';
import { PeopleService } from '../services/people.service';

@Controller('/v1/people')
@ApiTags('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get('/:id')
  @PublicRoute(true)
  @ApiOperation({ summary: 'Get people by id' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'People retrieved successfully',
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'People not found',
  })
  async getPeopleById(@Param('id') id: string) {
    const numberId = Number.parseInt(id, 10);
    const people = await this.peopleService.getPeopleById(numberId);

    return people;
  }
}
