import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BomberCarPositionHistoryDocument =
  HydratedDocument<BomberCarPositionHistory>;

@Schema()
export class BomberCarPositionHistory {
  @Prop({ required: true })
  bomberCarId: string;

  @Prop({ required: true })
  lon: number;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const BomberCarPositionHistorySchema = SchemaFactory.createForClass(
  BomberCarPositionHistory,
);
