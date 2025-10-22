import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, isValidObjectId } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UpdateWorkoutStatsDto } from './dto/update-workout-stats.dto';
import { Workout, WorkoutDocument } from './schemas/workout.schema';
import { ListWorkoutsDto } from './dto/list-workouts.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name)
    private readonly workoutModel: Model<WorkoutDocument>,
  ) {}

  async findAll(
    listDto: ListWorkoutsDto,
  ): Promise<{ data: Workout[]; total: number; page: number; limit: number }> {
    const page = listDto.page ?? 1;
    const limit = Math.min(listDto.limit ?? 10, 100);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<WorkoutDocument> = {};

    // Add difficulty filter
    if (listDto.difficulty) {
      filter.difficulty = listDto.difficulty;
    }

    // Add duration filters
    if (listDto.min_duration !== undefined || listDto.max_duration !== undefined) {
      filter.duration_minutes = {};
      if (listDto.min_duration !== undefined) {
        filter.duration_minutes.$gte = listDto.min_duration;
      }
      if (listDto.max_duration !== undefined) {
        filter.duration_minutes.$lte = listDto.max_duration;
      }
    }

    const [data, total] = await Promise.all([
      this.workoutModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.workoutModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Workout> {
    const workout = await this.workoutModel.findOne({ uid: id }).lean().exec();

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return workout;
  }

  async updateStats(
    id: string,
    updateDto: UpdateWorkoutStatsDto,
  ): Promise<Workout> {
    const increments: Record<string, number> = {};

    if (updateDto.views !== undefined) {
      increments['stats.views'] = updateDto.views;
    }
    if (updateDto.completions !== undefined) {
      increments['stats.completions'] = updateDto.completions;
    }
    if (updateDto.favorites !== undefined) {
      increments['stats.favorites'] = updateDto.favorites;
    }
    if (updateDto.avg_rating !== undefined) {
      increments['stats.avg_rating'] = updateDto.avg_rating;
    }

    if (Object.keys(increments).length === 0) {
      throw new BadRequestException('No stat fields provided for update');
    }

    const updatedWorkout = await this.workoutModel
      .findOneAndUpdate(
        { uid: id },
        { $inc: increments },
        { new: true, lean: true, runValidators: true },
      )
      .exec();

    if (!updatedWorkout) {
      throw new NotFoundException('Workout not found');
    }

    return updatedWorkout;
  }
}