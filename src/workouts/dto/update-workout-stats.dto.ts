import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateWorkoutStatsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  views?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  completions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  favorites?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  avg_rating?: number;
}
