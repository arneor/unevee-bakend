import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, isValidObjectId } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Program, ProgramDocument } from './schemas/program.schema';
import { ListProgramsDto } from './dto/list-programs.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectModel(Program.name)
    private readonly programModel: Model<ProgramDocument>,
  ) {}

  async findAll(
    listDto: ListProgramsDto,
  ): Promise<{ data: Program[]; total: number; page: number; limit: number }> {
    const page = listDto.page ?? 1;
    const limit = Math.min(listDto.limit ?? 10, 100);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ProgramDocument> = {};

    // Add difficulty level filter
    if (listDto.difficulty_level) {
      filter.difficulty_level = listDto.difficulty_level;
    }

    // Add duration filters
    if (listDto.min_duration !== undefined || listDto.max_duration !== undefined) {
      filter.duration_days = {};
      if (listDto.min_duration !== undefined) {
        filter.duration_days.$gte = listDto.min_duration;
      }
      if (listDto.max_duration !== undefined) {
        filter.duration_days.$lte = listDto.max_duration;
      }
    }

    const [data, total] = await Promise.all([
      this.programModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.programModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Program> {
    let filter: FilterQuery<ProgramDocument>;
    if (isValidObjectId(id)) {
      filter = { _id: id };
    } else {
      filter = {
        $or: [{ program_id: id }, { slug: id }],
      } as FilterQuery<ProgramDocument>;
    }

    const program = await this.programModel.findOne(filter).lean().exec();

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return program;
  }
}