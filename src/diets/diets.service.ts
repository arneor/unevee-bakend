import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { MongoServerError } from 'mongodb';
import { FilterQuery, Model, isValidObjectId } from 'mongoose';
import { CreateDietDto } from './dto/create-diet.dto';
import { ListDietsDto } from './dto/list-diets.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { Diet, DietDocument } from './schemas/diet.schema';

@Injectable()
export class DietsService {
  constructor(
    @InjectModel(Diet.name)
    private readonly dietModel: Model<DietDocument>,
  ) {}

  async create(createDietDto: CreateDietDto): Promise<Diet> {
    const slug =
      createDietDto.slug ?? this.buildSlug(createDietDto.title) ?? randomUUID();

    try {
      const created = await this.dietModel.create({
        ...createDietDto,
        diet_id: randomUUID(),
        slug,
      });
      return created.toObject();
    } catch (error) {
      this.handleMongoError(error);
    }
  }

  async findAll(
    listDto: ListDietsDto,
  ): Promise<{ data: Diet[]; total: number; page: number; limit: number }> {
    const page = listDto.page ?? 1;
    const limit = Math.min(listDto.limit ?? 10, 100);
    const skip = (page - 1) * limit;

    const filter: FilterQuery<DietDocument> = {};
    if (listDto.orgId) {
      filter.org_id = listDto.orgId;
    } else {
      // If no orgId is provided, only show public diets
      filter.is_public = true;
    }

    if (listDto.branchId) {
      filter.branch_id = listDto.branchId;
    }

    // Add difficulty level filter
    if (listDto.difficulty_level) {
      filter.difficulty_level = listDto.difficulty_level;
    }

    // Add calories filters
    if (
      listDto.min_calories !== undefined ||
      listDto.max_calories !== undefined
    ) {
      const caloriesFilter: { $gte?: number; $lte?: number } = {};
      if (listDto.min_calories !== undefined) {
        caloriesFilter.$gte = listDto.min_calories;
      }
      if (listDto.max_calories !== undefined) {
        caloriesFilter.$lte = listDto.max_calories;
      }
      filter.calories_per_day = caloriesFilter;
    }

    const [data, total] = await Promise.all([
      this.dietModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.dietModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(dietId: string): Promise<Diet> {
    const filter: FilterQuery<DietDocument> = { diet_id: dietId };

    const diet = await this.dietModel.findOne(filter).lean().exec();
    if (!diet) {
      throw new NotFoundException('Diet not found');
    }

    return diet;
  }

  async update(id: string, updateDietDto: UpdateDietDto): Promise<Diet> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid diet id');
    }

    const payload = this.stripUndefined({
      ...updateDietDto,
    });
    if (!updateDietDto.slug && updateDietDto.title) {
      payload.slug = this.buildSlug(updateDietDto.title);
    }

    try {
      const updatedDiet = await this.dietModel
        .findByIdAndUpdate(id, payload, {
          new: true,
          runValidators: true,
          lean: true,
        })
        .exec();

      if (!updatedDiet) {
        throw new NotFoundException('Diet not found');
      }

      return updatedDiet;
    } catch (error) {
      this.handleMongoError(error);
    }
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid diet id');
    }

    const result = await this.dietModel
      .findById(id)
      .select('_id')
      .lean()
      .exec();
    if (!result) {
      throw new NotFoundException('Diet not found');
    }
    // Soft-delete or archiving can be added later. Intentionally left blank.
  }

  private stripUndefined<T extends Record<string, unknown>>(value: T): T {
    Object.keys(value).forEach((key) => {
      if (value[key] === undefined) {
        delete value[key];
      }
    });
    return value;
  }

  private buildSlug(input: string): string {
    const base = input
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Generate timestamp with milliseconds
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ''); // e.g., 20251019T230451.123 → 20251019T230451123

    // Combine base + timestamp
    return `${base}-${timestamp}`;
  }

  private handleMongoError(error: unknown): never {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ConflictException(
        'Diet with provided unique fields already exists',
      );
    }
    throw error;
  }
}
