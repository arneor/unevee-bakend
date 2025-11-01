import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class DietMacroBreakdown {
  @Prop({ type: Number, default: 0 })
  protein: number;

  @Prop({ type: Number, default: 0 })
  carbs: number;

  @Prop({ type: Number, default: 0 })
  fats: number;
}

const DietMacroBreakdownSchema =
  SchemaFactory.createForClass(DietMacroBreakdown);

@Schema({ _id: false })
class DietMealDetails {
  @Prop({ required: true })
  meal_type: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  ingredients: string[];

  @Prop({ type: Number, default: 0 })
  calories: number;

  @Prop({ type: DietMacroBreakdownSchema, default: () => ({}) })
  macros: DietMacroBreakdown;

  @Prop({ type: [String], default: [] })
  instructions: string[];
}

const DietMealDetailsSchema = SchemaFactory.createForClass(DietMealDetails);

@Schema({ _id: false })
class DietDailyMeals {
  @Prop({ type: Number, required: true })
  day_number: number;

  @Prop({ type: [DietMealDetailsSchema], default: [] })
  meals: DietMealDetails[];
}

const DietDailyMealsSchema = SchemaFactory.createForClass(DietDailyMeals);

@Schema({ _id: false })
class DietStats {
  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  completions: number;

  @Prop({ type: Number, default: 0 })
  favorites: number;

  @Prop({ type: Number, default: 0 })
  avg_rating: number;
}

const DietStatsSchema = SchemaFactory.createForClass(DietStats);

@Schema({ _id: false })
class DietAudit {
  @Prop({ required: true })
  env: string;

  @Prop()
  created_by?: string;

  @Prop()
  updated_by?: string;
}

const DietAuditSchema = SchemaFactory.createForClass(DietAudit);

@Schema({ collection: 'diets', timestamps: true })
export class Diet {
  @Prop({ required: true })
  org_id: string;

  @Prop()
  branch_id?: string;

  @Prop({ required: true })
  diet_id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ type: Number, default: 0 })
  duration_days: number;

  @Prop()
  difficulty_level?: string;

  @Prop()
  primary_goal?: string;

  @Prop({ type: Number, default: 0 })
  calories_per_day: number;

  @Prop({ type: DietMacroBreakdownSchema, default: () => ({}) })
  macros: DietMacroBreakdown;

  @Prop({ type: [DietDailyMealsSchema], default: [] })
  meals: DietDailyMeals[];

  @Prop({ default: 'draft' })
  status: string;

  @Prop({ type: Boolean, default: true })
  is_public: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: DietStatsSchema, default: () => ({}) })
  stats: DietStats;

  @Prop({ type: DietAuditSchema, default: () => ({ env: 'dev' }) })
  audit: DietAudit;
}

export type DietDocument = HydratedDocument<Diet>;

export const DietSchema = SchemaFactory.createForClass(Diet);
DietSchema.index({ org_id: 1 });
DietSchema.index({ branch_id: 1 });
DietSchema.index({ diet_id: 1 }, { unique: true });
DietSchema.index({ slug: 1 }, { unique: true, sparse: true });
