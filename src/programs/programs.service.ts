import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, isValidObjectId } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Program, ProgramDocument } from './schemas/program.schema';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectModel(Program.name)
    private readonly programModel: Model<ProgramDocument>,
  ) {}

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<{ data: Program[]; total: number; page: number; limit: number }> {
    const page = pagination.page ?? 1;
    const limit = Math.min(pagination.limit ?? 10, 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.programModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.programModel.countDocuments().exec(),
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
