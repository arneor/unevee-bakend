import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateDietDto } from './dto/create-diet.dto';
import { ListDietsDto } from './dto/list-diets.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { DietsService } from './diets.service';

@Controller()
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  @Post('diets')
  create(@Body() createDietDto: CreateDietDto) {
    return this.dietsService.create(createDietDto);
  }

  @Get('diets')
  findAll(@Query() query: ListDietsDto) {
    return this.dietsService.findAll(query);
  }

  @Get('organization/:orgId/diets')
  findByOrganization(
    @Param('orgId') orgId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.dietsService.findAll({ ...query, orgId });
  }

  @Get('diets/:dietId')
  findOne(@Param('dietId') dietId: string) {
    return this.dietsService.findOne(dietId);
  }

  @Put('diets/:id')
  replace(@Param('id') id: string, @Body() updateDietDto: UpdateDietDto) {
    return this.dietsService.update(id, updateDietDto);
  }

  @Patch('diets/:id')
  update(@Param('id') id: string, @Body() updateDietDto: UpdateDietDto) {
    return this.dietsService.update(id, updateDietDto);
  }
}
