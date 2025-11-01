import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ProgramsService } from './programs.service';
import { ListProgramsDto } from './dto/list-programs.dto';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  findAll(@Query() query: ListProgramsDto) {
    return this.programsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programsService.findOne(id);
  }
}
