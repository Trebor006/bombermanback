import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BomberCarPositionDocument = HydratedDocument<BomberCarPosition>;

@Schema()
export class BomberCarPosition {
  @Prop({ required: true })
  ambulanciaId: string;

  @Prop({ required: true })
  lon: number;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const BomberCarPositionSchema =
  SchemaFactory.createForClass(BomberCarPosition);
