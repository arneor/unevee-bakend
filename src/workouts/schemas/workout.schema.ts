import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class WorkoutTaxonomyItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;
}

const WorkoutTaxonomyItemSchema =
  SchemaFactory.createForClass(WorkoutTaxonomyItem);

@Schema({ _id: false })
class WorkoutTaxonomy {
  @Prop({ type: WorkoutTaxonomyItemSchema })
  category?: WorkoutTaxonomyItem;

  @Prop({ type: WorkoutTaxonomyItemSchema })
  type?: WorkoutTaxonomyItem;
}

const WorkoutTaxonomySchema = SchemaFactory.createForClass(WorkoutTaxonomy);

@Schema({ _id: false })
class WorkoutStats {
  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  completions: number;

  @Prop({ type: Number, default: 0 })
  favorites: number;

  @Prop({ type: Number, default: 0 })
  avg_rating: number;
}

const WorkoutStatsSchema = SchemaFactory.createForClass(WorkoutStats);

@Schema({ _id: false })
class WorkoutMediaVariant {
  @Prop({ required: true })
  variant: string;

  @Prop()
  processing_status?: string;

  @Prop({ type: Number, default: null })
  duration_seconds?: number | null;

  @Prop({ type: [String], default: [] })
  available_resolutions: string[];

  @Prop({ type: [String], default: [] })
  mp4_keys: string[];

  @Prop({ type: [String], default: [] })
  captions: string[];
}

const WorkoutMediaVariantSchema =
  SchemaFactory.createForClass(WorkoutMediaVariant);

@Schema({ _id: false })
class WorkoutMedia {
  @Prop({ type: [WorkoutMediaVariantSchema], default: [] })
  variants: WorkoutMediaVariant[];
}

const WorkoutMediaSchema = SchemaFactory.createForClass(WorkoutMedia);

@Schema({ _id: false })
class WorkoutInstruction {
  @Prop({ type: Number, required: true })
  step_number: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

const WorkoutInstructionSchema =
  SchemaFactory.createForClass(WorkoutInstruction);

@Schema({ _id: false })
class WorkoutAudit {
  @Prop()
  org_id?: string;

  @Prop()
  created_by?: string;

  @Prop()
  env?: string;
}

const WorkoutAuditSchema = SchemaFactory.createForClass(WorkoutAudit);

@Schema({ collection: 'workouts', timestamps: true })
export class Workout {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  schema_version?: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: WorkoutTaxonomySchema })
  taxonomy?: WorkoutTaxonomy;

  @Prop()
  difficulty?: string;

  @Prop({ type: Number })
  duration_minutes?: number;

  @Prop({ type: [String], default: [] })
  equipment_needed: string[];

  @Prop({ type: [String], default: [] })
  primary_muscles: string[];

  @Prop({ type: [String], default: [] })
  secondary_muscles: string[];

  @Prop()
  tags?: string;

  @Prop()
  status?: string;

  @Prop({ type: Boolean, default: true })
  is_public: boolean;

  @Prop({ type: [String], default: [] })
  available_variants: string[];

  @Prop({ type: WorkoutStatsSchema, default: () => ({}) })
  stats: WorkoutStats;

  @Prop({ type: WorkoutMediaSchema, default: () => ({ variants: [] }) })
  media: WorkoutMedia;

  @Prop({ type: [WorkoutInstructionSchema], default: [] })
  instructions: WorkoutInstruction[];

  @Prop({ type: WorkoutAuditSchema, default: () => ({}) })
  audit: WorkoutAudit;
}

export type WorkoutDocument = HydratedDocument<Workout>;

export const WorkoutSchema = SchemaFactory.createForClass(Workout);
