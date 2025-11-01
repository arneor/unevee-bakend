import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class ProgramExercise {
  @Prop({ required: true })
  exercise_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, default: 0 })
  sets: number;

  @Prop({ type: Number, default: 0 })
  reps: number;

  @Prop({ type: Number, default: 0 })
  duration_seconds: number;

  @Prop({ type: Number, default: 0 })
  rest_seconds: number;

  @Prop({ type: [String], default: [] })
  instructions: string[];

  @Prop({ type: [String], default: [] })
  tips: string[];
}

const ProgramExerciseSchema = SchemaFactory.createForClass(ProgramExercise);

@Schema({ _id: false })
class ProgramWorkout {
  @Prop({ required: true })
  workout_id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  thumbnail_url?: string;

  @Prop()
  video_url?: string;

  @Prop({ type: Number, default: 0 })
  duration_minutes: number;

  @Prop()
  difficulty_level?: string;

  @Prop()
  category?: string;

  @Prop()
  goal?: string;

  @Prop({ type: [String], default: [] })
  equipment_required: string[];

  @Prop({ type: [String], default: [] })
  target_muscles: string[];

  @Prop({ type: Number, default: 0 })
  calories_burned: number;

  @Prop({ type: [ProgramExerciseSchema], default: [] })
  exercises: ProgramExercise[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  status?: string;

  @Prop({ type: Boolean, default: true })
  is_public: boolean;

  @Prop({ type: Number, default: 0 })
  order_in_day: number;
}

const ProgramWorkoutSchema = SchemaFactory.createForClass(ProgramWorkout);

@Schema({ _id: false })
class ProgramDay {
  @Prop({ type: Number, required: true })
  day_number: number;

  @Prop({ type: [ProgramWorkoutSchema], default: [] })
  workouts: ProgramWorkout[];
}

const ProgramDaySchema = SchemaFactory.createForClass(ProgramDay);

@Schema({ _id: false })
class ProgramStats {
  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  enrollments: number;

  @Prop({ type: Number, default: 0 })
  completions: number;

  @Prop({ type: Number, default: 0 })
  avg_rating: number;
}

const ProgramStatsSchema = SchemaFactory.createForClass(ProgramStats);

@Schema({ _id: false })
class ProgramAudit {
  @Prop()
  env?: string;

  @Prop()
  updated_by?: string;
}

const ProgramAuditSchema = SchemaFactory.createForClass(ProgramAudit);

@Schema({ _id: false })
class TaxonomyCategory {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;
}

const TaxonomyCategorySchema = SchemaFactory.createForClass(TaxonomyCategory);

@Schema({ _id: false })
class ProgramTaxonomy {
  @Prop({ type: TaxonomyCategorySchema })
  category?: TaxonomyCategory;

  @Prop({ type: TaxonomyCategorySchema })
  type?: TaxonomyCategory;
}

const ProgramTaxonomySchema = SchemaFactory.createForClass(ProgramTaxonomy);

@Schema({ collection: 'programs', timestamps: true })
export class Program {
  @Prop({ required: true })
  program_id: string;

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

  @Prop({ type: [String], default: [] })
  category: string[];

  @Prop({ type: [String], default: [] })
  target_audience: string[];

  @Prop({ type: [ProgramDaySchema], default: [] })
  days: ProgramDay[];

  @Prop({ type: Number, default: 0 })
  total_workouts: number;

  @Prop({ type: Number, default: 0 })
  total_exercises: number;

  @Prop({ type: Number, default: 0 })
  estimated_total_calories: number;

  @Prop()
  status?: string;

  @Prop({ type: Boolean, default: false })
  is_public: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: ProgramStatsSchema, default: () => ({}) })
  stats: ProgramStats;

  @Prop({ type: ProgramAuditSchema, default: () => ({}) })
  audit: ProgramAudit;

  @Prop()
  thumbnail_url?: string;

  @Prop({ type: ProgramTaxonomySchema })
  taxonomy?: ProgramTaxonomy;
}

export type ProgramDocument = HydratedDocument<Program>;

export const ProgramSchema = SchemaFactory.createForClass(Program);
