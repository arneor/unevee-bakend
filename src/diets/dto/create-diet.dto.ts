import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class MacroDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  protein?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  carbs?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  fats?: number;
}

class MealMacroDto extends MacroDto {}

class MealDto {
  @IsString()
  @IsNotEmpty()
  meal_type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  calories?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => MealMacroDto)
  macros?: MealMacroDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  instructions?: string[];
}

class DietDayDto {
  @IsInt()
  @Min(1)
  day_number: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MealDto)
  meals: MealDto[];
}

export class CreateDietDto {
  @IsString()
  @IsNotEmpty()
  org_id: string;

  @IsOptional()
  @IsString()
  partner_id?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration_days?: number;

  @IsOptional()
  @IsString()
  difficulty_level?: string;

  @IsOptional()
  @IsString()
  primary_goal?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  calories_per_day?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => MacroDto)
  macros?: MacroDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DietDayDto)
  meals?: DietDayDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assigned_to?: string[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
