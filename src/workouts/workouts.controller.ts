import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UpdateWorkoutStatsDto } from './dto/update-workout-stats.dto';
import { WorkoutsService } from './workouts.service';
import { ListWorkoutsDto } from './dto/list-workouts.dto';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  findAll(@Query() query: ListWorkoutsDto) {
    return this.workoutsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutsService.findOne(id);
  }

  @Patch(':id/stats')
  updateStats(
    @Param('id') id: string,
    @Body() updateWorkoutStatsDto: UpdateWorkoutStatsDto,
  ) {
    return this.workoutsService.updateStats(id, updateWorkoutStatsDto);
  }
}